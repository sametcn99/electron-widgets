import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { copySync } from "fs-extra";
import { execFile } from "child_process";
import { getDiskInfoSync } from "node-disk-info";
import Drive from "node-disk-info/dist/classes/drive";
import { opmlToJSON } from "opml-to-json";
import { getAllData } from "systeminformation";
import { IpcChannels } from "../../../lib/ipc-channels";
import {
  getWidgetsJson,
  setWidgetsJson,
  createSingleWindowForWidgets,
  windowManager,
} from "../../../utils";
import Parser from "rss-parser";
import { config } from "../../../lib/config";
import { preset } from "../../../lib/preset";

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
        dialog.showErrorBox("Unknown action", `Unknown action: ${action}`);
        break;
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
  return getWidgetsJson(config.widgetsJsonPath);
});

/**
 * Handles the 'write-widgets-json' IPC message by writing data to the widgets.json file.
 * Writes the provided data to widgets.json in the app directory and also to public/widgets/widgets.json.
 * Catches any errors writing and logs them.
 */
ipcMain.handle(IpcChannels.WRITE_WIDGETS_JSON, (event, data) => {
  setWidgetsJson(data, config.widgetsJsonPath);
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
  try {
    windowManager.getAllWindowsExceptMain().forEach((win) => {
      if (win.title === key) {
        win.close();
      }
    });
  } catch (error) {
    console.error("Error closing widget window:", error);
    dialog.showErrorBox("Error closing widget window", `${error}`);
  }
});

// Handles the 'resize-widget-window' IPC message by updating the width and height of the widget window.
ipcMain.handle(IpcChannels.RESIZE_WIDGET_WINDOW, () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.title !== config.applicationName) {
    const title: string =
      BrowserWindow.getFocusedWindow()?.getTitle() as string;
    const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath);
    if (
      win &&
      widgets[title] &&
      widgets[title].title !== config.applicationName &&
      widgets[title].locked === false
    ) {
      widgets[title].width = win.getSize()[0];
      widgets[title].height = win.getSize()[1];
      setWidgetsJson(widgets, config.widgetsJsonPath);
    } else {
      console.error(
        `Widget with title "${title}" not found in widgets config.`,
        dialog.showErrorBox(
          "Widget not found",
          `Widget with title "${title}" not found in widgets config.`,
        ),
      );
    }
  }
});

// Handles the 'drag-widget-window' IPC message by updating the position of the widget window.
// This function gets the currently focused BrowserWindow instance and updates the x and y coordinates
// of the widget in the widgets.json file based on the window's position.
ipcMain.handle(IpcChannels.DRAG_WIDGET_WINDOW, () => {
  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath);
  const win = BrowserWindow.getFocusedWindow();
  const title: string = win?.getTitle() as string;
  if (
    win &&
    widgets[title] &&
    win?.isFocused() &&
    widgets[title].title !== config.applicationName &&
    widgets[title].locked === false
  ) {
    widgets[title].x = win.getPosition()[0];
    widgets[title].y = win.getPosition()[1];
    setWidgetsJson(widgets, config.widgetsJsonPath);
  }
  if (
    win &&
    widgets[title] &&
    win?.isFocused() &&
    widgets[title].title !== config.applicationName &&
    widgets[title].locked === true
  ) {
    win.setPosition(widgets[title].x, widgets[title].y);
  }
});

// Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
ipcMain.handle(IpcChannels.OPEN_EXTERNAL_LINK, (event, url) => {
  shell.openExternal(url);
});

// Handles the 'open-external-link' IPC message by opening the provided URL in the default browser.
ipcMain.handle(IpcChannels.OPEN_EXTERNAL_APP, (event, url) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execFile(url, (error: any) => {
    if (error) {
      console.error("Error opening external app:", error);
      dialog.showErrorBox("Error opening external app", `${error}`);
    }
    console.log("External app opened successfully.");
  });
});

// Handles the 'get-disk-usage' IPC message by returning the disk usage information.
ipcMain.handle(IpcChannels.GET_DISK_USAGE, () => {
  try {
    const disks: Drive[] = getDiskInfoSync();
    return disks;
  } catch (e) {
    console.error(e);
    dialog.showErrorBox("Error getting disk usage", `${e}`);
  }
});

// Handles the 'open-directory' IPC message by showing the widgets.json file in the file explorer.
ipcMain.handle(IpcChannels.OPEN_DIRECTORY, () => {
  shell.showItemInFolder(config.widgetsJsonPath);
});

// Handles the 'show-all-widgets' IPC message by showing all widget windows except the main window.
ipcMain.handle(IpcChannels.SHOW_ALL_WIDGETS, () => {
  windowManager.getAllWindowsExceptMain().forEach((win) => {
    win.show();
  });
});

/**
 * Adds a widget as a plugin.
 * This function prompts the user to select a folder to add as a widget. It then creates a destination directory for the widget and copies the widget files to the destination directory. It also updates the widgets.json file with the widget information. If the widget already exists, an error message is shown. If the selected directory does not contain an index.html file, an error message is shown as well.
 * @returns {Promise<void>} A promise that resolves when the widget is added successfully.
 */
ipcMain.handle(IpcChannels.ADD_WIDGET_DIALOG, async () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
      title: "Select a folder to add as a widget.",
      defaultPath: config.homePath,
    });
    if (canceled) {
      return;
    } else {
      const srcDir = filePaths[0];
      const srcDirName = path.basename(filePaths[0]);

      // Create the destination directory for the widget
      mkdirSync(path.join(config.widgetsDir, srcDirName), { recursive: true });

      const indexhtml = path.join(filePaths[0], "index.html");

      if (existsSync(indexhtml)) {
        // Copy the widget files to the destination directory
        copySync(path.join(srcDir), path.join(config.widgetsDir, srcDirName), {
          overwrite: true,
        });
        getWidgetsJson(config.widgetsJsonPath);
        if (
          Object.keys(getWidgetsJson(config.widgetsJsonPath)).includes(
            srcDirName,
          )
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
          const widgetsData = getWidgetsJson(config.widgetsJsonPath);
          widgetsData[srcDirName] = preset;
          widgetsData[srcDirName].title = srcDirName;
          setWidgetsJson(widgetsData, config.widgetsJsonPath);
          // Show success message and restart the app
          dialog.showMessageBox(mainWindow, {
            type: "info",
            message: "Widget added successfully.",
            detail:
              "The widget has been added to the widgets directory and added config to widgets.json file.",
          });
        }
      } else {
        // Show error message if the selected directory does not contain an index.html file
        dialog.showMessageBox(mainWindow, {
          type: "error",
          message: "Invalid widget directory.",
          detail: "The selected directory does not contain an index.html file.",
        });
      }
    }
  }
});

// Handles the 'system-info' IPC message by returning system information.
ipcMain.handle(IpcChannels.SYSTEM_INFO, async () => {
  return getAllData();
});

// Handles the 'refresh-widget' IPC message by reloading the widget window.
ipcMain.handle(IpcChannels.RELOAD_WIDGET, () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.title !== config.applicationName) {
    win?.reload();
  }
});

// Handles the 'lock-widget' IPC message by locking or unlocking the widget window.
// This function gets the currently focused BrowserWindow instance and toggles the locked property
// of the widget in the widgets.json file based on the window's title.
// If the window is locked, it sets the window resizable property to false.
// If the window is unlocked, it sets the window resizable property to true.
// If the window title is the main window title, an error message is shown.
ipcMain.handle(IpcChannels.LOCK_WIDGET, (event, widgetId) => {
  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath);
  widgets[widgetId].locked = !widgets[widgetId].locked;
  if (widgets[widgetId].locked === true) {
    widgets[widgetId].resizable = false;
  } else if (widgets[widgetId].locked === false) {
    widgets[widgetId].resizable = true;
  }
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reloadAllWidgets();
});

// Handles the 'get-location' IPC message by retrieving the user's location.
// This function uses the systeminformation library to get the user's location.
// If the location is successfully retrieved, it is returned as a string.
// If an error occurs, an error message is shown.
ipcMain.handle(IpcChannels.GET_LOCATION, async () => {
  try {
    const location = fetch("http://ip-api.com/json/").then((response) =>
      response.json(),
    );
    return location;
  } catch (error) {
    console.error("Error getting location:", error);
    dialog.showErrorBox("Error getting location", `${error}`);
  }
});

// Handles the 'show-notification' IPC message by showing a notification.
// This function creates a notification with the provided title and message
// and shows it to the user.
ipcMain.handle(IpcChannels.RSS_FEED_PARSER, (event, url) => {
  const parser = new Parser();
  return parser.parseURL(url);
});

// Handles the 'rss-feed-parser' IPC message by parsing an RSS feed.
// This function uses the rss-parser library to parse an RSS feed from the provided URL.
ipcMain.handle(IpcChannels.OPML_TO_JSON, async (event, xml) => {
  return opmlToJSON(xml);
});
