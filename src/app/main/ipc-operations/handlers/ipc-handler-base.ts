import { ipcMain } from 'electron'
import { IpcChannels } from '../../../../lib/ipc-channels'

/**
 * Abstract base class for IPC handlers.
 * All IPC handler classes should extend this class and implement the register method.
 */
export abstract class IpcHandlerBase {
  /**
   * Registers all IPC handlers for this class.
   * This method must be implemented by all subclasses.
   */
  public abstract register(): void

  /**
   * Helper method to register an IPC handler.
   * @param channel - The IPC channel to handle.
   * @param handler - The handler function.
   */
  protected registerHandler(
    channel: IpcChannels,
    handler: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
  ): void {
    ipcMain.handle(channel, handler)
  }

  /**
   * Helper method to unregister an IPC handler.
   * @param channel - The IPC channel to unregister.
   */
  protected unregisterHandler(channel: IpcChannels): void {
    ipcMain.removeHandler(channel)
  }
}
