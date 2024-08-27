import { dialog } from 'electron'
import path from 'node:path'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs'

/**
 * Reads the widgets.json file and returns its contents as a string.
 * @param widgetsJsonPath - The path to the widgets.json file.
 * @returns The contents of the widgets.json file as a string.
 * @throws If an error occurs while reading the file.
 */
export function getWidgetsJson(widgetsJsonPath: string): WidgetsConfig {
  try {
    const widgetsDataRaw = readFileSync(widgetsJsonPath, 'utf-8')
    const widgetsData: WidgetsConfig = JSON.parse(widgetsDataRaw)
    return widgetsData
  } catch (error) {
    dialog.showErrorBox('Failed to read data', `${error}`)
    throw error
  }
}

/**
 * Writes the given JSON data to the widgets.json file located at the given path.
 * @param jsonData - The JSON data to write.
 * @param widgetsJsonPath - The path to the widgets.json file.
 */
export function setWidgetsJson(
  jsonData: WidgetsConfig,
  widgetsJsonPath: string
) {
  try {
    writeFileSync(widgetsJsonPath, JSON.stringify(jsonData, null, 2))
  } catch (err) {
    dialog.showErrorBox('Error writing to data', `${err}`)
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
      console.log('widgets directory is not found. Copying...')

      // Create the destination directory if it doesn't exist
      mkdirSync(widgetsDir, { recursive: true })
      // Read the contents of the source directory
      const entries = readdirSync(sourceWidgetsDir, { withFileTypes: true })

      // Iterate over the contents of the source directory
      for (const entry of entries) {
        const srcPath = path.join(sourceWidgetsDir, entry.name)
        const destPath = path.join(widgetsDir, entry.name)

        // Recursively copy directories, or copy files directly
        entry.isDirectory()
          ? copyWidgetsDirIfNeeded(srcPath, destPath)
          : copyFileSync(srcPath, destPath)
      }
    }
  } catch (error) {
    dialog.showErrorBox('Failed to copy widgets directory', `${error}`)
  }
}
