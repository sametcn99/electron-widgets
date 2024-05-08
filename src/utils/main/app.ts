import { app, BrowserWindow } from "electron";
import { createWindowsForWidgets } from "../browser-windows/widget-windows";
import "./ipc";
import { registerTray } from "./tray";
import { copyWidgetsDirIfNeeded } from "../widgets-folder-utils";
import { sourceWidgetsDir, widgetsDir } from "../../lib/constants";
import { createMainWindow } from "../browser-windows/main-window";

/**
 * Registers the Electron app and sets up necessary event handlers and functionality.
 * This function should be called to initialize the Electron app.
 */

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  copyWidgetsDirIfNeeded(sourceWidgetsDir, widgetsDir);
  createMainWindow();
  createWindowsForWidgets();
  registerTray();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Set the application to automatically start at login
app.setLoginItemSettings({
  openAtLogin: true, // Open the app at login
  enabled: true, // Enable this setting
});
