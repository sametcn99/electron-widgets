import { dialog } from 'electron'
import path from 'node:path'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { config } from '../../lib/config'

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
  } catch (error: any) {
    // If the widgets.json file is missing, initialize it from the public template
    // or create an empty config so the app can start gracefully.
    if (error && error.code === 'ENOENT') {
      try {
        const targetDir = path.dirname(widgetsJsonPath)
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true })
        }

        const defaultJsonPath = path.join(
          config.sourceWidgetsDir,
          'widgets.json',
        )
        let initial: WidgetsConfig = {}
        if (existsSync(defaultJsonPath)) {
          const raw = readFileSync(defaultJsonPath, 'utf-8')
          initial = JSON.parse(raw)
        }
        writeFileSync(widgetsJsonPath, JSON.stringify(initial, null, 2))
        return initial
      } catch (initErr) {
        dialog.showErrorBox('Failed to initialize widgets.json', `${initErr}`)
        throw initErr
      }
    }
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
  widgetsJsonPath: string,
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
  widgetsDir: string,
) {
  try {
    // Ensure destination directory exists
    if (!existsSync(widgetsDir)) {
      mkdirSync(widgetsDir, { recursive: true })
    }

    // Read the contents of the source directory
    const entries = readdirSync(sourceWidgetsDir, { withFileTypes: true })

    // Copy only missing entries to avoid clobbering user changes
    for (const entry of entries) {
      const srcPath = path.join(sourceWidgetsDir, entry.name)
      const destPath = path.join(widgetsDir, entry.name)

      if (entry.isDirectory()) {
        // If the widget folder does not exist in destination, copy recursively
        if (!existsSync(destPath)) {
          copyWidgetsDirIfNeeded(srcPath, destPath)
        }
      } else {
        // Copy missing files (e.g., default widgets.json) but never overwrite
        if (!existsSync(destPath)) {
          copyFileSync(srcPath, destPath)
        }
      }
    }
  } catch (error) {
    dialog.showErrorBox('Failed to copy widgets directory', `${error}`)
  }
}
