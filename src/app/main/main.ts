/**
 * Entry point of the application.
 * Registers the app and initializes it.
 */
import { app } from "electron";
import { config } from "../../lib/config";
import {
  copyWidgetsDirIfNeeded,
  createMainWindow,
  createWindowsForWidgets,
  displayControl,
  windowManager,
  registerTray
} from "../../utils";
import "./ipc-operations/global";
import "./ipc-operations/app-operations";
import "./ipc-operations/widget-window";
import "./ipc-operations/widget-visibility";
import "./ipc-operations/widget-data";
import { updateElectronApp } from "update-electron-app";

/**
 * Registers the Electron app and sets up necessary event handlers and functionality.
 * This function should be called to initialize the Electron app.
 */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}
updateElectronApp(); // additional configuration options available

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  copyWidgetsDirIfNeeded(config.sourceWidgetsDir, config.widgetsDir);
  createMainWindow();
  displayControl();
  createWindowsForWidgets();
  registerTray();
  app.on("activate", () => {
    if (windowManager.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Set the application to automatically start at login
app.setLoginItemSettings({
  openAtLogin: true, // Open the app at login
});
