import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import { IpcChannels } from "../../lib/channels/ipc-channels";
import { applicationName, appName, widgetsJsonPath } from "../../lib/constants";
import {
  getAllWindowsExceptMain,
  reloadAllWidgets,
} from "../browser-windows/utils";
import { createSingleWindowForWidgets } from "../browser-windows/widget-windows";
import {
  addWidgetAsPlugin,
  getDiskUsage,
  getWidgetsJson,
  setWidgetsJson,
} from "../utils";
import { execFile } from "child_process";
import { getAllData } from "systeminformation";
import { showNotification } from "../notification";

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
  try {
    getAllWindowsExceptMain().forEach((win) => {
      if (win.title === key) {
        win.close();
      }
    });
  } catch (error) {
    console.error("Error closing widget window:", error);
    dialog.showErrorBox("Error closing widget window", `${error}`);
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
  if (win?.title !== appName) {
    const title: string =
      BrowserWindow.getFocusedWindow()?.getTitle() as string;
    const widgets: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
    if (
      win &&
      widgets[title] &&
      widgets[title].title !== applicationName &&
      widgets[title].locked === false
    ) {
      widgets[title].width = win.getSize()[0];
      widgets[title].height = win.getSize()[1];
      setWidgetsJson(widgets, widgetsJsonPath);
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
  const widgets: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
  const win = BrowserWindow.getFocusedWindow();
  const title: string = win?.getTitle() as string;
  if (
    win &&
    widgets[title] &&
    win?.isFocused() &&
    widgets[title].title !== applicationName &&
    widgets[title].locked === false
  ) {
    widgets[title].x = win.getPosition()[0];
    widgets[title].y = win.getPosition()[1];
    setWidgetsJson(widgets, widgetsJsonPath);
  }
  if (
    win &&
    widgets[title] &&
    win?.isFocused() &&
    widgets[title].title !== applicationName &&
    widgets[title].locked === true
  ) {
    win.setPosition(widgets[title].x, widgets[title].y);
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
  addWidgetAsPlugin();
});

// Handles the 'system-info' IPC message by returning system information.
ipcMain.handle(IpcChannels.SYSTEM_INFO, async () => {
  return getAllData();
});

// Handles the 'refresh-widget' IPC message by reloading the widget window.
ipcMain.handle(IpcChannels.RELOAD_WIDGET, () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.title !== appName) {
    win?.reload();
  }
});

// Handles the 'lock-widget' IPC message by locking or unlocking the widget window.
// This function gets the currently focused BrowserWindow instance and toggles the locked property
// of the widget in the widgets.json file based on the window's title.
// If the window is locked, it sets the window resizable property to false.
// If the window is unlocked, it sets the window resizable property to true.
// If the window title is the main window title, an error message is shown.
ipcMain.handle(IpcChannels.LOCK_WIDGET, () => {
  const win = BrowserWindow.getFocusedWindow();
  const title: string = win?.getTitle() as string;
  const widgets: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
  widgets[title].locked = !widgets[title].locked;

  if (win?.title !== appName) {
    if (widgets[title].locked === true) {
      win?.setResizable(false);
      widgets[title].resizable = false;
    }
  } else if (widgets[title].locked === false) {
    win?.setResizable(true);
    widgets[title].resizable = true;
  } else {
    console.error("Main window cannot be locked.");
  }
  setWidgetsJson(widgets, widgetsJsonPath);
  reloadAllWidgets();
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
ipcMain.handle(IpcChannels.SHOW_NOTIFICATION, (event, title, message) => {
  showNotification(title, message);
});
