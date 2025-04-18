import { BrowserWindow, dialog } from 'electron'
import { IpcChannels } from '../../../../lib/ipc-channels'
import { IpcHandlerBase } from './ipc-handler-base'

/**
 * Handles global window actions such as minimize, maximize, restore, and close.
 */
export class GlobalHandler extends IpcHandlerBase {
  /**
   * Registers all global IPC handlers.
   */
  public register(): void {
    this.registerHandler(IpcChannels.WINDOW_ACTION, this.handleWindowAction.bind(this))
  }

  /**
   * Handles window actions such as minimize and close.
   * @param event - The event object.
   * @param action - The action to perform on the window.
   */
  private handleWindowAction(event: Electron.IpcMainInvokeEvent, action: string): void {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      switch (action) {
        case 'minimize':
          win.minimize()
          break
        case 'maximize':
          win.maximize()
          break
        case 'restore':
          win.restore()
          break
        case 'close':
          win.close()
          break
        default:
          console.log(`Unknown action: ${action}`)
          dialog.showErrorBox('Unknown action', `Unknown action: ${action}`)
          break
      }
    }
  }
}
