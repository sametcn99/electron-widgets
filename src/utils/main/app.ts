import { app, BrowserWindow } from "electron";
import { createWindow, createWindowsForWidgets } from "../create-windows";
import { sourceWidgetsDir, widgetsDir } from "../../lib/constants";
import { copyWidgetsDirIfNeeded } from "../utils";

export function runAppFunctions() {
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
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
