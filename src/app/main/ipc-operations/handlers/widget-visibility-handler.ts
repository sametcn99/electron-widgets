import { BrowserWindow, dialog } from 'electron'
import { IpcChannels } from '../../../../lib/ipc-channels'
import {
  getWidgetsJson,
  setWidgetsJson,
  windowManager,
  createWindowsForWidgets
} from '../../../../utils'
import { config } from '../../../../lib/config'
import { IpcHandlerBase } from './ipc-handler-base'

/**
 * Handles operations related to widget visibility.
 */
export class WidgetVisibilityHandler extends IpcHandlerBase {
  /**
   * Registers all widget visibility IPC handlers.
   */
  public register(): void {
    this.registerHandler(IpcChannels.RELOAD_WIDGET, this.handleReloadWidget.bind(this))
    this.registerHandler(IpcChannels.RECREATE_WIDGET, this.handleRecreateWidget.bind(this))
    this.registerHandler(IpcChannels.RESIZE_WIDGET_WINDOW, this.handleResizeWidgetWindow.bind(this))
    this.registerHandler(IpcChannels.DRAG_WIDGET_WINDOW, this.handleDragWidgetWindow.bind(this))
    this.registerHandler(IpcChannels.SHOW_ALL_WIDGETS, this.handleShowAllWidgets.bind(this))
    this.registerHandler(IpcChannels.LOCK_WIDGET, this.handleLockWidget.bind(this))
    this.registerHandler(IpcChannels.SET_ALWAYS_ON_TOP, this.handleSetAlwaysOnTop.bind(this))
    this.registerHandler(IpcChannels.SHOW_WIDGET, this.handleShowWidget.bind(this))
    this.registerHandler(IpcChannels.SET_VISIBILITY_ALL_WIDGETS, this.handleSetVisibilityAllWidgets.bind(this))
  }

  /**
   * Handles the reloading of a widget window.
   * @param event - The event object.
   * @param widgetKey - The key of the widget.
   */
  private handleReloadWidget(event: Electron.IpcMainInvokeEvent, widgetKey: string): void {
    windowManager.reloadWidget(widgetKey)
  }

  /**
   * Handles the recreating of a widget window.
   * @param event - The event object.
   * @param widgetKey - The key of the widget.
   */
  private handleRecreateWidget(event: Electron.IpcMainInvokeEvent, widgetKey: string): void {
    windowManager.reCreateWidget(widgetKey)
  }

  /**
   * Handles the resizing of a widget window.
   */
  private handleResizeWidgetWindow(): void {
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
            `Widget with title "${title}" not found in widgets config.`
          )
        )
      }
    }
  }

  /**
   * Handles the dragging of a widget window.
   */
  private handleDragWidgetWindow(): void {
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
  }

  /**
   * Handles the showing of all widget windows.
   */
  private handleShowAllWidgets(): void {
    windowManager.getAllWindowsExceptMain().forEach((win) => {
      win.show()
    })
  }

  /**
   * Handles the locking/unlocking of a widget.
   * @param event - The event object.
   * @param widgetKey - The key of the widget.
   */
  private handleLockWidget(event: Electron.IpcMainInvokeEvent, widgetKey: string): void {
    const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    if (widgets[widgetKey].locked === true) {
      widgets[widgetKey].locked = false
    } else if (widgets[widgetKey].locked === false) {
      widgets[widgetKey].locked = true
    }
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reCreateWidget(widgetKey)
  }

  /**
   * Handles setting the always-on-top property of a widget.
   * @param event - The event object.
   * @param widgetKey - The key of the widget.
   * @param alwaysOnTop - The value indicating whether the widget should always be on top.
   */
  private handleSetAlwaysOnTop(
    event: Electron.IpcMainInvokeEvent, 
    widgetKey: string, 
    alwaysOnTop: boolean
  ): void {
    const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    widgets[widgetKey].alwaysOnTop = alwaysOnTop
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reCreateWidget(widgetKey)
    windowManager.reloadMainWindow()
  }

  /**
   * Handles showing a widget window.
   * @param event - The event object.
   * @param widgetKey - The key of the widget.
   */
  private handleShowWidget(event: Electron.IpcMainInvokeEvent, widgetKey: string): void {
    windowManager.showWidget(widgetKey)
  }

  /**
   * Handles setting the visibility of all widgets.
   * @param event - The event object.
   * @param visible - The visibility of the widgets.
   */
  private handleSetVisibilityAllWidgets(
    event: Electron.IpcMainInvokeEvent, 
    visible: boolean
  ): void {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    Object.keys(widgets).forEach((key) => {
      widgets[key].visible = visible
    })
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.closeAllWindowsExceptMain()
    createWindowsForWidgets()
    windowManager.reloadMainWindow()
  }
}
