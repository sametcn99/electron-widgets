import { BrowserWindow, dialog } from "electron";
import { register } from "electron-localshortcut";
import { copySync } from "fs-extra";
import { getDiskInfoSync } from "node-disk-info";
import Drive from "node-disk-info/dist/classes/drive";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { homePath, widgetsDir, widgetsJsonPath } from "../lib/constants";
import { preset } from "../lib/preset";

/**
 * Registers a keyboard shortcut to open the dev tools when pressing F12.
 * @export
 * @param {BrowserWindow} win - The BrowserWindow instance.
 */
export function openDevToolsWithShortcut(win: BrowserWindow) {
  register(win, "F12", () => {
    win.webContents.openDevTools();
  });
}

/**
 * Reads the widgets.json file and returns its contents as a string.
 * @param widgetsJsonPath - The path to the widgets.json file.
 * @returns The contents of the widgets.json file as a string.
 * @throws If an error occurs while reading the file.
 */
export function getWidgetsJson(widgetsJsonPath: string): WidgetsConfig {
  try {
    const widgetsDataRaw = readFileSync(widgetsJsonPath, "utf-8");
    const widgetsData: WidgetsConfig = JSON.parse(widgetsDataRaw);
    return widgetsData;
  } catch (error) {
    dialog.showErrorBox("Failed to read widgets.json", `${error}`);
    throw error;
  }
}

/**
 * Writes the given JSON data to the widgets.json file located at the given path.
 * @param jsonData - The JSON data to write.
 * @param widgetsJsonPath - The path to the widgets.json file.
 */
export function setWidgetsJson(
  jsonData: WidgetsConfig,
  widgetsJsonPath: string,
) {
  try {
    writeFileSync(widgetsJsonPath, JSON.stringify(jsonData, null, 2));
  } catch (err) {
    dialog.showErrorBox("Error writing to widgets.json", `${err}`);
  }
}

/**
 * Retrieves the disk usage information for all drives.
 * @returns An array of Drive objects representing the disk usage information for each drive.
 */
export function getDiskUsage() {
  try {
    const disks: Drive[] = getDiskInfoSync();
    return disks;
  } catch (e) {
    console.error(e);
    dialog.showErrorBox("Error getting disk usage", `${e}`);
  }
}

/**
 * Merges two widget configurations, with the properties from the `preset` taking precedence over the `source`.
 * @param source - The source widget configuration.
 * @param preset - The preset widget configuration.
 * @returns A new object that is a merge of the `preset` and `source` configurations.
 */
export function mergeWithPreset(source: WidgetConfig, preset: WidgetConfig) {
  return Object.assign({}, preset, source);
}

/**
 * Adds a widget as a plugin.
 * This function prompts the user to select a folder to add as a widget. It then creates a destination directory for the widget and copies the widget files to the destination directory. It also updates the widgets.json file with the widget information. If the widget already exists, an error message is shown. If the selected directory does not contain an index.html file, an error message is shown as well.
 *
 * @returns {Promise<void>} A promise that resolves when the widget is added successfully.
 */
export async function addWidgetAsPlugin() {
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
        if (Object.keys(getWidgetsJson(widgetsJsonPath)).includes(srcDirName)) {
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
          widgetsData[srcDirName].title = srcDirName;
          setWidgetsJson(widgetsData, widgetsJsonPath);
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
}
