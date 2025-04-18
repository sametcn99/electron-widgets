import { GlobalHandler } from './handlers/global-handler'
import { AppOperationsHandler } from './handlers/app-operations-handler'
import { WidgetDataHandler } from './handlers/widget-data-handler'
import { WidgetVisibilityHandler } from './handlers/widget-visibility-handler'
import { WidgetWindowHandler } from './handlers/widget-window-handler'
import { IpcHandlerBase } from './handlers/ipc-handler-base'

/**
 * IPC Manager class that manages all IPC handlers.
 * This class is responsible for registering all IPC handlers.
 */
export class IpcManager {
  private static instance: IpcManager
  private handlers: IpcHandlerBase[] = []

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {
    this.initializeHandlers()
  }

  /**
   * Gets the singleton instance of the IpcManager.
   * @returns The singleton instance of the IpcManager.
   */
  public static getInstance(): IpcManager {
    if (!IpcManager.instance) {
      IpcManager.instance = new IpcManager()
    }
    return IpcManager.instance
  }

  /**
   * Initializes all IPC handlers.
   */
  private initializeHandlers(): void {
    this.handlers = [
      new GlobalHandler(),
      new AppOperationsHandler(),
      new WidgetDataHandler(),
      new WidgetVisibilityHandler(),
      new WidgetWindowHandler()
    ]
  }

  /**
   * Registers all IPC handlers.
   */
  public registerHandlers(): void {
    this.handlers.forEach(handler => handler.register())
    console.log('All IPC handlers registered successfully.')
  }

  /**
   * Adds a new handler to the handlers list.
   * @param handler - The handler to add.
   */
  public addHandler(handler: IpcHandlerBase): void {
    this.handlers.push(handler)
    handler.register()
  }
}
