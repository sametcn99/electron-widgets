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
ipcMain.handle(IpcChannels.RESIZE_WIDGET_WINDOW, () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win?.title !== config.applicationName) {
    const title: string = BrowserWindow.getFocusedWindow()?.getTitle() as string
    const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    if (
      win &&
      widgets[title] &&
      widgets[title].title !== config.applicationName &&
      widgets[title].locked === false
    ) {
      widgets[title].width = win.getSize()[0]
      widgets[title].height = win.getSize()[1]
      setWidgetsJson(widgets, config.widgetsJsonPath)
    } else {
      console.error(
        `Widget with title "${title}" not found in widgets config.`,
        dialog.showErrorBox(
          'Widget not found',
          `Widget with title "${title}" not found in widgets config.`,
        ),
      )
    }
  }
})

/**
 * Handles the dragging of a widget window.
 */
ipcMain.handle(IpcChannels.DRAG_WIDGET_WINDOW, () => {
  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
  const win = BrowserWindow.getFocusedWindow()
  const title: string = win?.getTitle() as string
  if (
    win &&
    widgets[title] &&
    win?.isFocused() &&
    widgets[title].title !== config.applicationName &&
    widgets[title].locked === false
  ) {
    widgets[title].x = win.getPosition()[0]
    widgets[title].y = win.getPosition()[1]
    setWidgetsJson(widgets, config.widgetsJsonPath)
  }
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
