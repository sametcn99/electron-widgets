import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  dialog,
} from "electron";
import path from "node:path";
import {
  getWidgetsJson,
  mergeWithPreset,
  openDevToolsWithShortcut,
  setWidgetsJson,
} from "../utils";
import { widgetsDir, widgetsJsonPath } from "../../lib/constants";
import { preset } from "../../lib/preset";

/**
 * Creates windows for widgets defined in the widgets.json file.
 * Parses the widgets data and creates a BrowserWindow for each widget
 * that has the "visible" property set to true. If no "positionX" or
 * "positionY" is defined, it will generate random values and update
 * the widgets.json file.
 */
export function createWindowsForWidgets() {
  try {
    // Parse the widgets JSON data
    const widgetsData: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
    if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
      dialog.showErrorBox(
        "Error parsing widgets data",
        "Unexpected widgets data structure",
      );
      return;
    }
    // Iterate through each widget in the data
    Object.entries(widgetsData).forEach(([key, widget]) => {
      // Merge the widget with the preset values
      widgetsData[key] = mergeWithPreset(widget, preset);

      // check if the widget is locked and set resizable to false if it is locked set it to true
      if (widgetsData[key].locked === true) {
        widgetsData[key].resizable = false;
      } else {
        widgetsData[key].resizable = true;
      }
      setWidgetsJson(widgetsData, widgetsJsonPath);
      // Check if the widget is set to be visible
      if (widget.visible) {
        createSingleWindowForWidgets(key);
      }
    });
  } catch (err) {
    dialog.showErrorBox(`Error parsing widgets data`, `${err}`);
  }
}

/**
 * Creates a single window for the given widget key.
 * Parses the widgets configuration, checks if the given widget is visible,
 * generates random positions if needed, creates a BrowserWindow instance
 * and loads the widget HTML file into it.
 *
 * @param key - The key of the widget to create a window for
 */
export function createSingleWindowForWidgets(key: string) {
  try {
    // Parse the widgets JSON data
    const widgetsData: WidgetsConfig = getWidgetsJson(widgetsJsonPath);
    if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
      dialog.showErrorBox(
        "Error parsing widgets data",
        "Unexpected widgets data structure",
      );
      return;
    }
    // Iterate through each widget in the data
    const widget: WidgetConfig & BrowserWindowConstructorOptions =
      widgetsData[key];
    // Check if the widget is set to be visible
    if (widget.visible) {
      try {
        // Create a new browser window for the widget
        const win = new BrowserWindow({
          title: widget.title,
          webPreferences: {
            contextIsolation: widget.webPreferences?.contextIsolation,
            nodeIntegration: widget.webPreferences?.nodeIntegration,
            preload: path.join(__dirname, "preload.js"), // Path to preload script
          },
          width: widget.width,
          height: widget.height,
          autoHideMenuBar: widget.autoHideMenuBar,
          titleBarStyle: widget.titleBarStyle,
          transparent: widget.transparent,
          resizable: widget.resizable,
          x: widget.x,
          y: widget.y,
          maximizable: widget.maximizable,
          minimizable: widget.minimizable,
          skipTaskbar: widget.skipTaskbar,
          thickFrame: widget.thickFrame,
          frame: widget.frame,
          hasShadow: widget.hasShadow,
          closable: true,
        });

        // Load the widget's HTML file into the window
        const indexPath = path.join(widgetsDir, key, "index.html");
        win.loadFile(indexPath);
        openDevToolsWithShortcut(win);
      } catch (err) {
        dialog.showErrorBox(`Error creating window for ${key}`, `${err}`);
      }
    }
  } catch (err) {
    dialog.showErrorBox(`Error parsing widgets data`, `${err}`);
  }
}
