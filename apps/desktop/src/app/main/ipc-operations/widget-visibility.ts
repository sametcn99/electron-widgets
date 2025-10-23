import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'
import {
  getWidgetsJson,
  setWidgetsJson,
  windowManager,
  createWindowsForWidgets,
} from '../../../utils'
import { config } from '../../../lib/config'

/**
 * Handles getting the window title for the current window.
 */
ipcMain.handle('get-window-title', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  return win?.getTitle() || null
})

/**
 * Handles the reloading of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.RELOAD_WIDGET, (event, widgetKey) => {
  windowManager.reloadWidget(widgetKey)
})

/**
 * Handles the recreating of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.RECREATE_WIDGET, (event, widgetKey) => {
  windowManager.reCreateWidget(widgetKey)
})

/**
 * Handles the resizing of a widget window.
 */
ipcMain.handle(IpcChannels.RESIZE_WIDGET_WINDOW, (event, widgetKey: string) => {
  if (!widgetKey) {
    console.warn('No widget key provided during resize operation')
  }

  const win =
    BrowserWindow.fromWebContents(event.sender) ||
    BrowserWindow.getAllWindows().find((w) => w.getTitle() === widgetKey)

  if (!win) {
    console.warn(`Window not found for widget: ${widgetKey}`)
    return
  }

  const resolvedKey = widgetKey || win.getTitle()
  if (win.getTitle() === config.applicationName) {
    return
  }

  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
  const widget = widgets[resolvedKey]
  if (!widget) {
    console.error(`Widget "${resolvedKey}" not found in widgets config.`)
    return
  }

  if (widget.locked === true) {
    return
  }

  const [width, height] = win.getSize()
  widget.width = width
  widget.height = height
  setWidgetsJson(widgets, config.widgetsJsonPath)
})

/**
 * Handles the dragging of a widget window.
 */
ipcMain.handle(IpcChannels.DRAG_WIDGET_WINDOW, (event, widgetKey: string) => {
  if (!widgetKey) {
    console.warn('No widget key provided during drag operation')
  }

  const win =
    BrowserWindow.fromWebContents(event.sender) ||
    BrowserWindow.getAllWindows().find((w) => w.getTitle() === widgetKey)

  if (!win) {
    return
  }

  const resolvedKey = widgetKey || win.getTitle()
  if (win.getTitle() === config.applicationName) {
    return
  }

  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
  const widget = widgets[resolvedKey]
  if (!widget) {
    return
  }

  if (widget.locked === true) {
    return
  }

  const [x, y] = win.getPosition()
  widget.x = x
  widget.y = y
  setWidgetsJson(widgets, config.widgetsJsonPath)
})

/**
 * Handles the showing of all widget windows.
 */
ipcMain.handle(IpcChannels.SHOW_ALL_WIDGETS, () => {
  windowManager.getAllWindowsExceptMain().forEach((win) => {
    win.show()
  })
})

/**
 * Handles the locking/unlocking of a widget.
 * @param event - The event object.
 * @param widgetKey - The key of the widget.
 */
ipcMain.handle(IpcChannels.LOCK_WIDGET, (event, widgetKey) => {
  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
  if (widgets[widgetKey].locked === true) {
    widgets[widgetKey].locked = false
  } else if (widgets[widgetKey].locked === false) {
    widgets[widgetKey].locked = true
  }
  setWidgetsJson(widgets, config.widgetsJsonPath)
  windowManager.reCreateWidget(widgetKey)
})

/**
 * Handles setting the always-on-top property of a widget.
 * @param event - The event object.
 * @param widgetKey - The key of the widget.
 * @param alwaysOnTop - The value indicating whether the widget should always be on top.
 */
ipcMain.handle(
  IpcChannels.SET_ALWAYS_ON_TOP,
  (event, widgetKey: string, alwaysOnTop: boolean) => {
    const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    widgets[widgetKey].alwaysOnTop = alwaysOnTop
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reCreateWidget(widgetKey)
    windowManager.reloadMainWindow()
  },
)

/**
 * Handles showing a widget window.
 * @param event - The event object.
 * @param widgetKey - The key of the widget.
 */
ipcMain.handle(IpcChannels.SHOW_WIDGET, (event, widgetKey: string) => {
  windowManager.showWidget(widgetKey)
})

/**
 * Handles setting the visibility of all widgets.
 * @param event - The event object.
 * @param visible - The visibility of the widgets.
 */
ipcMain.handle(
  IpcChannels.SET_VISIBILITY_ALL_WIDGETS,
  (event, visible: boolean) => {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    Object.keys(widgets).forEach((key) => {
      widgets[key].visible = visible
    })
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.closeAllWindowsExceptMain()
    createWindowsForWidgets()
    windowManager.reloadMainWindow()
  },
)
