import { dialog } from "electron";
import path from "node:path";
import StreamZip from "node-stream-zip";
import { config } from "../../lib/config";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";

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
    dialog.showErrorBox("Failed to read data", `${error}`);
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
    dialog.showErrorBox("Error writing to data", `${err}`);
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
      }
    }
  } catch (error) {
    dialog.showErrorBox("Failed to copy widgets directory", `${error}`);
  }
}

/**
 * Downloads and copies the widgets folder if it doesn't already exist.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function downloadAndCopyWidgetsFolderIfNeeded() {
  // Check if the widgets directory exists
  if (!existsSync(config.widgetsDir)) {
    console.log("Directory is not found. Copying...");
    await downloadAndCopyWidgetsFolder();
  }
}

/**
 * Downloads and copies the widgets folder from a remote URL.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function downloadAndCopyWidgetsFolder() {
  try {
    // Fetch the zip file from the URL
    const arrayBuffer = await fetch(config.sourceCodeUrl).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to download folder. HTTP status ${res.status}`);
      }
      return res.blob().then((blob) => blob.arrayBuffer());
    });

    // Define the path where the zip file will be saved
    const zipPath = path.join(config.homePath, "widgets.zip");
    // Write the array buffer to a file
    writeFileSync(zipPath, new Uint8Array(arrayBuffer));
    // Open the zip file
    const zip = new StreamZip.async({ file: zipPath });
    // Get the entries of the zip file
    const entries = await zip.entries();
    // Define the path of the extracted zip file
    const extractedZipPath = path
      .join(`${Object.keys(entries)[0]}`, "public", "widgets")
      .replace(/\\/g, "/");
    // Extract the zip file to the widgets directory
    await zip.extract(extractedZipPath, config.widgetsDir);
    // Close the zip file
    await zip.close();
    // Remove the zip file
    rmSync(zipPath);
  } catch (error) {
    // If there's an error, show it
    dialog.showErrorBox("Error downloading folder", `${error}`);
  }
}
