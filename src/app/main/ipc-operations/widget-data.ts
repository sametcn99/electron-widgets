import { BrowserWindow, dialog, ipcMain, shell } from "electron";
import path from "node:path";
import { copySync, existsSync, mkdirSync, rmSync } from "fs-extra";
import { IpcChannels } from "../../../lib/ipc-channels";
import {
  getWidgetsJson,
  setWidgetsJson,
  createSingleWindowForWidgets,
  windowManager,
} from "../../../utils";
import { config } from "../../../lib/config";
import { preset } from "../../../lib/preset";

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
  });
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reloadMainWindow();
  windowManager.reCreateAllWidgets();
});

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

/**
 * Handles opening the widgets folder in the file explorer.
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

      const indexhtml = path.join(filePaths[0], "index.html");

      if (existsSync(indexhtml)) {
        mkdirSync(path.join(config.widgetsDir, srcDirName), {
          recursive: true,
        });

        copySync(path.join(srcDir), path.join(config.widgetsDir, srcDirName), {
          overwrite: true,
        });
        getWidgetsJson(config.widgetsJsonPath);
        if (
          Object.keys(getWidgetsJson(config.widgetsJsonPath)).includes(
            srcDirName,
          )
        ) {
          dialog.showMessageBox(mainWindow, {
            type: "error",
            message: "Widget already exists.",
            detail: "The widget is already in the widgets directory.",
          });
          return;
        } else {
          const widgetsData = getWidgetsJson(config.widgetsJsonPath);
          widgetsData[srcDirName] = preset;
          widgetsData[srcDirName].title = srcDirName;
          setWidgetsJson(widgetsData, config.widgetsJsonPath);

          dialog.showMessageBox(mainWindow, {
            type: "info",
            message: "Widget added successfully.",
            detail:
              "The widget has been added to the widgets directory and added config to widgets.json file.",
          });
        }
        createSingleWindowForWidgets(srcDirName);
        windowManager.reloadAllWindows();
      } else {
        dialog.showMessageBox(mainWindow, {
          type: "error",
          message: "Invalid widget directory.",
          detail: "The selected directory does not contain an index.html file.",
        });
      }
    }
  }
});

/**
 * Handles removing a widget.
 * @param event - The event object.
 * @param widgetKey - The key of the widget to remove.
 */
ipcMain.handle(IpcChannels.REMOVE_WIDGET, async (event, widgetKey) => {
  const widgets = getWidgetsJson(config.widgetsJsonPath);
  delete widgets[widgetKey];
  const path = `${config.widgetsDir}/${widgetKey}`;
  rmSync(path, { recursive: true, force: true });
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reloadAllWindows();
});

/**
 * Handles duplicating a widget.
 * @param event - The event object.
 * @param widgetKey - The key of the widget to duplicate.
 */
ipcMain.handle(IpcChannels.DUPLICATE_WIDGET, async (event, widgetKey) => {
  const widgets = getWidgetsJson(config.widgetsJsonPath);
  const widget = widgets[widgetKey];
  const widgetFolderPath = path.join(config.widgetsDir, widgetKey);
  const randomNumber = Math.floor(Math.random() * 1000);
  const newWidgetId = `${widgetKey}-${randomNumber}`;
  const newWidgetFolderPath = path.join(config.widgetsDir, newWidgetId);
  copySync(widgetFolderPath, newWidgetFolderPath);
  widgets[newWidgetId] = { ...widget };
  widgets[newWidgetId].title = newWidgetId
  widgets[newWidgetId].visible = false;
  widgets[newWidgetId].x = 10;
  widgets[newWidgetId].y = 10;
  widgets[newWidgetId].locked = false;
  widgets[newWidgetId].alwaysOnTop = false;
  setWidgetsJson(widgets, config.widgetsJsonPath);
  windowManager.reloadAllWindows();
});
