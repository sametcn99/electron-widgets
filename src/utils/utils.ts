import { BrowserWindow } from "electron";
import electronLocalshortcut from "electron-localshortcut";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFile,
} from "node:fs";
import path from "node:path";

/**
 * Registers a keyboard shortcut to open the dev tools when pressing F12.
 * @export
 * @param {BrowserWindow} win - The BrowserWindow instance.
 */
export function openDevToolsWithShortcut(win: BrowserWindow) {
  electronLocalshortcut.register(win, "F12", () => {
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
    const widgetsData = readFileSync(widgetsJsonPath, "utf-8");
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
export async function setWidgetsJson(
  jsonData: string,
  widgetsJsonPath: string
) {
  try {
    console.log("Writing to widgets.json:", widgetsJsonPath);
    await writeFile(widgetsJsonPath, jsonData, (err) => {
      if (err) {
        console.error(`Error writing to widgets.json: ${err}`);
        return;
      }
      console.log("Data has been written to widgets.json");
    });
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
  widgetsDir: string
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
