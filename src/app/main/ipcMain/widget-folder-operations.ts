import { ipcMain, shell } from "electron";
import { IpcChannels } from "../../../lib/ipc-channels";
import {
  createWindowsForWidgets,
  getWidgetsJson,
  setWidgetsJson,
  windowManager,
} from "../../../utils";
import { config } from "../../../lib/config";

/**
 * Handles reading the widgets JSON file.
 * @returns The contents of the widgets JSON file.
 */
ipcMain.handle(IpcChannels.READ_WIDGETS_JSON, () => {
  return getWidgetsJson(config.widgetsJsonPath);
});

/**
 * Handles writing data to the widgets JSON file.
 * @param event - The event object.
 * @param data - The data to write to the widgets JSON file.
 */
ipcMain.handle(IpcChannels.WRITE_WIDGETS_JSON, (event, data) => {
  setWidgetsJson(data, config.widgetsJsonPath);
});

/**
 * Handles revealing the widgets folder in the file explorer.
 */
ipcMain.handle(IpcChannels.REVEAL_WIDGETS_FOLDER, () => {
  shell.showItemInFolder(config.widgetsJsonPath);
});

/**
 * Handles setting the visibility of all widgets.
 * @param event - The event object.
 * @param visible - The visibility of the widgets.
 */
ipcMain.handle(IpcChannels.SET_LOCK_ALL_WIDGETS, (event, lock: boolean) => {
  const widgets = getWidgetsJson(config.widgetsJsonPath);
  Object.keys(widgets).forEach((key) => {
    widgets[key].locked = lock;
    windowManager.reCreateWidget(key);
  });
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reloadAllWindows();
});

/**
 * Handles setting the visibility of all widgets.
 * @param event - The event object.
 * @param visible - The visibility of the widgets.
 */
ipcMain.handle(
  IpcChannels.SET_VISIBILITY_ALL_WIDGETS,
  (event, visible: boolean) => {
    const widgets = getWidgetsJson(config.widgetsJsonPath);
    Object.keys(widgets).forEach((key) => {
      widgets[key].visible = visible;
    });
    setWidgetsJson(widgets, config.widgetsJsonPath);
    windowManager.closeAllWindowsExceptMain();
    createWindowsForWidgets();
    windowManager.reloadMainWindow();
  },
);

/**
 * Handles sorting the widgets.
 */
ipcMain.handle(IpcChannels.SORT_WIDGETS, () => {
  const widgets = getWidgetsJson(config.widgetsJsonPath);
  const sortedKeys = Object.keys(widgets).sort();
  const sortedWidgets: { [key: string]: WidgetConfig } = {};
  sortedKeys.forEach((key: string) => {
    sortedWidgets[key] = widgets[key];
  });
  setWidgetsJson(sortedWidgets, config.widgetsJsonPath);
  windowManager.reloadMainWindow();
});
