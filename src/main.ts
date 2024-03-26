import { app, BrowserWindow, ipcMain } from "electron";
import { createWindow, createWindowsForWidgets } from "./utils/createWindows";
import { sourceWidgetsDir, widgetsDir, widgetsJsonPath } from "./lib/constants";
import {
  copyWidgetsDirIfNeeded,
  getWidgetsJson,
  setWidgetsJson,
} from "./utils/utils";

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and import them here.

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

/**
 * IPC FUNCTIONS
 * Inter-process communication (IPC) is a key part of building feature-rich desktop applications in Electron.
 * Because the main and renderer processes have different responsibilities in Electron's process model,
 * IPC is the only way to perform many common tasks, such as calling a native API from your UI or
 * triggering changes in your web contents from native menus.
 */

/**
 * Handles the 'window-action' IPC message by performing an action on the focused window.
 * When the 'window-action' message is received, this gets the currently focused
 * BrowserWindow instance and performs an action (minimize, close) based on the
 * passed action parameter.
 */
ipcMain.handle("window-action", (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    switch (action) {
      case "minimize":
        win.minimize();
        break;
      case "close":
        win.close();
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  }
});

/**
 * Handles the 'read-widgets-json' IPC message by returning the contents of the
 * widgets.json file.
 * When the message is received, this function reads the widgets.json file
 * located in the widgets directory and returns its contents as a string.
 */
ipcMain.handle("read-widgets-json", () => {
  return getWidgetsJson(widgetsJsonPath);
});

/**
 * Handles the 'write-widgets-json' IPC message by writing data to the widgets.json file.
 * Writes the provided data to widgets.json in the app directory and also to public/widgets/widgets.json.
 * Catches any errors writing and logs them.
 */
ipcMain.handle("write-widgets-json", async (event, data) => {
  setWidgetsJson(data, widgetsJsonPath);
});
