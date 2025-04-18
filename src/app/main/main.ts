/**
 * Entry point of the application.
 * Registers the app and initializes it using an OOP approach.
 */
import { app } from 'electron'
import { config } from '../../lib/config'
import {
  copyWidgetsDirIfNeeded,
  createMainWindow,
  createWindowsForWidgets,
  displayControl,
  windowManager,
  registerTray
} from '../../utils'
import './ipc-operations/global'
import './ipc-operations/app-operations'
import './ipc-operations/widget-window'
import './ipc-operations/widget-visibility'
import './ipc-operations/widget-data'
import { updateElectronApp } from 'update-electron-app'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// Initialize auto-updates
updateElectronApp() // additional configuration options available

class ElectronWidgetsApp {
  constructor() {
    // Bind app lifecycle methods
    this.onReady = this.onReady.bind(this)
    this.onActivate = this.onActivate.bind(this)
    this.registerAppListeners()
  }

  /**
   * Registers listeners for Electron app events.
   */
  private registerAppListeners(): void {
    app.on('ready', this.onReady)
    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    app.on('activate', this.onActivate)
  }

  /**
   * Called when Electron has finished initialization.
   */
  private async onReady(): Promise<void> {
    try {
      await copyWidgetsDirIfNeeded(config.sourceWidgetsDir, config.widgetsDir)
      createMainWindow()
      displayControl() // Initialize display control utilities
      createWindowsForWidgets() // Create windows for existing widgets
      registerTray() // Register the system tray icon
      this.configureAutoStart()
    } catch (error) {
      console.error('Failed during app ready sequence:', error)
      // Optionally, show an error dialog to the user
      app.quit() // Quit if essential setup fails
    }
  }

  /**
   * Called when the application is activated (e.g., clicking the dock icon on macOS).
   */
  private onActivate(): void {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windowManager.getAllWindows().length === 0) {
      createMainWindow()
    }
  }

  /**
   * Configures the application to start automatically at login.
   */
  private configureAutoStart(): void {
    // Set the application to automatically start at login
    if (!app.isPackaged) {
      console.log('Development mode: Skipping auto-start configuration.')
      return
    }
    app.setLoginItemSettings({
      openAtLogin: true // Open the app at login
      // You might want to add args or path depending on the OS and requirements
    })
  }

  /**
   * Starts the application lifecycle.
   * Note: The constructor already registers the necessary listeners.
   * This method could be used for additional startup logic if needed later.
   */
  public start(): void {
    console.log('ElectronWidgetsApp started.')
    // Since 'ready' is handled by the listener registered in the constructor,
    // this method might remain empty or be used for other purposes.
  }
}

// Create and start the application instance
const electronWidgetsApp = new ElectronWidgetsApp()
electronWidgetsApp.start() // Explicitly call start if it contains logic beyond listener registration
