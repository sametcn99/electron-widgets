import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { getDiskUsage, getWidgetsJson, setWidgetsJson } from "../utils";
import {
  applicationName,
  homePath,
  widgetsDir,
  widgetsJsonPath,
} from "../../lib/constants";
import { IpcChannels } from "../../channels/ipc-channels";
import { createSingleWindowForWidgets } from "../browser-windows/widget-windows";
import { getAllWindowsExceptMain } from "../browser-windows/utils";
import { copySync } from "fs-extra";
import path from "path";
import { mkdirSync, existsSync } from "node:fs";
import { preset } from "../../lib/preset";

/**
 * IPC FUNCTIONS
 * Inter-process communication (IPC) is a key part of building feature-rich desktop applications in Electron.
 * Because the main and renderer processes have different responsibilities in Electron's process model,
 * IPC is the only way to perform many common tasks, such as calling a native API from your UI or
 * triggering changes in your web contents from native menus.
 */

/**
 * Registers the main IPC event handlers.
 * This function sets up the event handlers for various IPC messages used in the application.
 */
export function registerMainIPC() {
  /**
   * Handles the 'window-action' IPC message by performing an action on the focused window.
   * When the 'window-action' message is received, this gets the currently focused
   * BrowserWindow instance and performs an action (minimize, close) based on the
   * passed action parameter.
   */
  ipcMain.handle(IpcChannels.WINDOW_ACTION, (event, action) => {
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
  ipcMain.handle(IpcChannels.READ_WIDGETS_JSON, () => {
    return getWidgetsJson(widgetsJsonPath);
  });

  /**
   * Handles the 'write-widgets-json' IPC message by writing data to the widgets.json file.
   * Writes the provided data to widgets.json in the app directory and also to public/widgets/widgets.json.
   * Catches any errors writing and logs them.
   */
  ipcMain.handle(IpcChannels.WRITE_WIDGETS_JSON, (event, data) => {
    setWidgetsJson(data, widgetsJsonPath);
  });

  /**
   * Handles the 'create-widget-window' IPC message by creating a new window to display widgets.
   * Opens a new window and passes the provided key to createSingleWindowForWidgets() to populate it with widgets.
   */
  ipcMain.handle(IpcChannels.CREATE_WIDGET_WINDOW, (event, key) => {
    createSingleWindowForWidgets(key);
  });

  /**
   * Handles the 'close-widget-window' IPC message by closing any window displaying widgets with the given key.
   * Loops through all open windows, checks if the window URL includes the passed key,
   * and closes the window if it matches.
   */
  ipcMain.handle(IpcChannels.CLOSE_WIDGET_WINDOW, (event, key) => {
    console.log("Closing widget window:", key);
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        if (win.webContents.getURL().includes(key)) {
          win.close();
        }
      });
    } catch (error) {
      console.error("Error closing widget window:", error);
    }
  });

  // Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
  ipcMain.handle(IpcChannels.OPEN_EXTERNAL_LINK, (event, url) => {
    console.log("Opening external link:", url);
    shell.openExternal(url);
  });

  // Handles the 'get-disk-usage' IPC message by returning the disk usage information.
  ipcMain.handle(IpcChannels.GET_DISK_USAGE, () => {
    return getDiskUsage();
  });

  // Handles the 'open-directory' IPC message by showing the widgets.json file in the file explorer.
  ipcMain.handle(IpcChannels.OPEN_DIRECTORY, () => {
    shell.showItemInFolder(widgetsJsonPath);
  });

  // Handles the 'show-all-widgets' IPC message by showing all widget windows except the main window.
  ipcMain.handle(IpcChannels.SHOW_ALL_WIDGETS, () => {
    getAllWindowsExceptMain().forEach((win) => {
      win.show();
    });
  });

  // Handles the 'resize-widget-window' IPC message by updating the width and height of the widget window.
  ipcMain.handle(IpcChannels.RESIZE_WIDGET_WINDOW, () => {
    const win = BrowserWindow.getFocusedWindow();
    const title: string =
      BrowserWindow.getFocusedWindow()?.getTitle() as string;
    console.log("Resizing widget window:", win?.getSize()[0], title);
    const widgets: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
    if (win && widgets[title]) {
      widgets[title].width = win.getSize()[0];
      widgets[title].height = win.getSize()[1];
      setWidgetsJson(widgets, widgetsJsonPath);
    } else {
      console.error(
        `Widget with title "${title}" not found in widgets config.`,
      );
    }
  });

  // Handles the 'drag-widget-window' IPC message by updating the position of the widget window.
  // This function gets the currently focused BrowserWindow instance and updates the x and y coordinates
  // of the widget in the widgets.json file based on the window's position.
  ipcMain.handle(IpcChannels.DRAG_WIDGET_WINDOW, () => {
    const widgets: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
    const win = BrowserWindow.getFocusedWindow();
    const title: string =
      BrowserWindow.getFocusedWindow()?.getTitle() as string;
    if (
      win &&
      widgets[title] &&
      win?.isFocused() &&
      widgets[title].title != applicationName
    ) {
      widgets[title].x = win.getPosition()[0];
      widgets[title].y = win.getPosition()[1];
      setWidgetsJson(widgets, widgetsJsonPath);
    }
  });

  // Handles the 'add-widget-dialog' IPC message by showing a dialog to add a new widget.
  // The dialog allows the user to select a folder to add as a widget. If the user cancels the dialog, nothing happens.
  // If the user selects a folder, the function checks if the folder contains an index.html file.
  // If the folder contains an index.html file, the function creates a destination directory for the widget,
  // copies the widget files to the destination directory, and adds the widget to the widgets.json file.
  // If the widget already exists, an error message is shown, and if the widget is added successfully, a success message is shown.
  // The app is then relaunched to reflect the changes.
  ipcMain.handle(IpcChannels.ADD_WIDGET_DIALOG, async () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory"],
        title: "Select a folder to add as a widget.",
        defaultPath: homePath,
      });
      if (canceled) {
        return;
      } else {
        const srcDir = filePaths[0];
        const srcDirName = path.basename(filePaths[0]);

        // Create the destination directory for the widget
        mkdirSync(path.join(widgetsDir, srcDirName), { recursive: true });

        const indexhtml = path.join(filePaths[0], "index.html");

        if (existsSync(indexhtml)) {
          // Copy the widget files to the destination directory
          copySync(path.join(srcDir), path.join(widgetsDir, srcDirName), {
            overwrite: true,
          });
          getWidgetsJson(widgetsJsonPath);
          if (
            Object.keys(getWidgetsJson(widgetsJsonPath)).includes(srcDirName)
          ) {
            // Show error message if the widget already exists
            dialog.showMessageBox(mainWindow, {
              type: "error",
              message: "Widget already exists.",
              detail: "The widget is already in the widgets directory.",
            });
            return;
          } else {
            // Add the widget to the widgets.json file
            const widgetsData = getWidgetsJson(widgetsJsonPath);
            widgetsData[srcDirName] = preset;
            setWidgetsJson(widgetsData, widgetsJsonPath);
            // Show success message and restart the app
            dialog.showMessageBox(mainWindow, {
              type: "info",
              message: "Widget added successfully.",
              detail:
                "The widget has been added to the widgets directory and added config to widgets.json file.",
            });
            app.relaunch();
            app.quit();
          }
        } else {
          // Show error message if the selected directory does not contain an index.html file
          dialog.showMessageBox(mainWindow, {
            type: "error",
            message: "Invalid widget directory.",
            detail:
              "The selected directory does not contain an index.html file.",
          });
        }
      }
    }
  });
}
