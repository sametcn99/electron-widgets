import { BrowserWindow } from "electron";
import { register } from "electron-localshortcut";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { getDiskInfoSync } from "node-disk-info";
import Drive from "node-disk-info/dist/classes/drive";

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
export function getWidgetsJson(widgetsJsonPath: string) {
  try {
    const widgetsDataRaw = readFileSync(widgetsJsonPath, "utf-8");
    const widgetsData: WidgetsConfig = JSON.parse(widgetsDataRaw);
    return widgetsData;
  } catch (error) {
    console.error("Failed to read widgets.json:", error);
    throw error;
  }
}

/**
 * Writes the given JSON data to the widgets.json file located at the given path.
 * @param jsonData - The JSON data to write.
 * @param widgetsJsonPath - The path to the widgets.json file.
 */
export function setWidgetsJson(jsonData: typeof JSON, widgetsJsonPath: string) {
  try {
    console.log("Writing to widgets.json:", widgetsJsonPath);
    writeFileSync(widgetsJsonPath, JSON.stringify(jsonData, null, 2));
  } catch (err) {
    console.error(`Error writing to widgets.json:`, err);
  }
}

/**
 * Copies the widgets directory if it does not already exist.
 * Recursively copies the contents of the source widgets directory to the
 * destination widgets directory, creating any missing directories.
 * @param {string} sourceWidgetsDir - The path to the source widgets directory
 * @param {string} widgetsDir - The path to the destination widgets directory
 */
export function copyWidgetsDirIfNeeded(
  sourceWidgetsDir: string,
  widgetsDir: string,
) {
  try {
    if (!existsSync(widgetsDir)) {
      console.log("widgets directory is not found. Copying...");

      // Create the destination directory if it doesn't exist
      mkdirSync(widgetsDir, { recursive: true });
      // Read the contents of the source directory
      const entries = readdirSync(sourceWidgetsDir, { withFileTypes: true });

      // Iterate over the contents of the source directory
      for (const entry of entries) {
        const srcPath = path.join(sourceWidgetsDir, entry.name);
        const destPath = path.join(widgetsDir, entry.name);

        // Recursively copy directories, or copy files directly
        entry.isDirectory()
          ? copyWidgetsDirIfNeeded(srcPath, destPath)
          : copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcPath} to ${destPath}`);
      }
    }
  } catch (error) {
    console.error("Failed to copy widgets directory:", error);
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
