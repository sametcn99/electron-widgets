import { BrowserWindow, dialog, ipcMain } from "electron";
import { IpcChannels } from "../../../lib/ipc-channels";
import {
  getWidgetsJson,
  setWidgetsJson,
  createSingleWindowForWidgets,
  windowManager,
} from "../../../utils";
import { config } from "../../../lib/config";

/**
 * Handles the creation of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.CREATE_WIDGET_WINDOW, (event, key) => {
  createSingleWindowForWidgets(key);
});

/**
 * Handles the closing of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
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

/**
 * Handles the reloading of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.RELOAD_WIDGET, (event, widgetKey) => {
  windowManager.reCreateWidget(widgetKey);
});

/**
 * Handles the resizing of a widget window.
 */
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

/**
 * Handles the dragging of a widget window.
 */
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

/**
 * Handles the showing of all widget windows.
 */
ipcMain.handle(IpcChannels.SHOW_ALL_WIDGETS, () => {
  windowManager.getAllWindowsExceptMain().forEach((win) => {
    win.show();
  });
});

/**
 * Handles the locking/unlocking of a widget.
 * @param event - The event object.
 * @param widgetKey - The key of the widget.
 */
ipcMain.handle(IpcChannels.LOCK_WIDGET, (event, widgetKey) => {
  const widgets: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath);
  if (widgets[widgetKey].locked === true) {
    widgets[widgetKey].locked = false;
  } else if (widgets[widgetKey].locked === false) {
    widgets[widgetKey].locked = true;
  }
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reCreateWidget(widgetKey);
});
