import { app, BrowserWindow } from "electron";
import { sourceWidgetsDir, widgetsDir } from "../../lib/constants";
import { createWindow } from "../browser-windows/main-window";
import { createWindowsForWidgets } from "../browser-windows/widget-windows";
import { copyWidgetsDirIfNeeded } from "../utils";
import { registerMainIPC } from "./ipc";
import { registerTray } from "./tray";

/**
 * Registers the Electron app and sets up necessary event handlers and functionality.
 * This function should be called to initialize the Electron app.
 */
export function registerApp() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require("electron-squirrel-startup")) {
    app.quit();
  }
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    copyWidgetsDirIfNeeded(sourceWidgetsDir, widgetsDir);
    createWindow();
    createWindowsForWidgets();
    registerTray();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  registerMainIPC();
}
