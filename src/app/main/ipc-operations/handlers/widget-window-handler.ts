import { dialog } from 'electron'
import { IpcChannels } from '../../../../lib/ipc-channels'
import { createSingleWindowForWidgets, windowManager } from '../../../../utils'
import { IpcHandlerBase } from './ipc-handler-base'

/**
 * Handles operations related to widget windows.
 */
export class WidgetWindowHandler extends IpcHandlerBase {
  /**
   * Registers all widget window IPC handlers.
   */
  public register(): void {
    this.registerHandler(IpcChannels.CREATE_WIDGET_WINDOW, this.handleCreateWidgetWindow.bind(this))
    this.registerHandler(IpcChannels.CLOSE_WIDGET_WINDOW, this.handleCloseWidgetWindow.bind(this))
  }

  /**
   * Handles the creation of a widget window.
   * @param event - The event object.
   * @param key - The key of the widget.
   */
  private handleCreateWidgetWindow(event: Electron.IpcMainInvokeEvent, key: string): void {
    createSingleWindowForWidgets(key)
  }

  /**
   * Handles the closing of a widget window.
   * @param event - The event object.
   * @param key - The key of the widget.
   */
  private handleCloseWidgetWindow(event: Electron.IpcMainInvokeEvent, key: string): void {
    try {
      windowManager.getAllWindowsExceptMain().forEach((win) => {
        if (win.title === key) win.close()
      })
    } catch (error) {
      console.error('Error closing widget window:', error)
      dialog.showErrorBox('Error closing widget window', `${error}`)
    }
  }
}
