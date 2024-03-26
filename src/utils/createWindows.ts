import { BrowserWindow } from "electron";
import path from "node:path";
import { getWidgetsJson, openDevToolsWithShortcut } from "./utils";
import { writeFileSync } from "node:fs";
import { widgetsDir, widgetsJsonPath } from "../lib/constants";

/**
 * Creates the main browser window.
 * Sets up the window with default dimensions and preferences. Loads either
 * the local dev server URL or built HTML file depending on environment.
 * Also opens the DevTools for development.
 */
export function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450, // Set the initial width of the window
    height: 650, // Set the initial height of the window
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Path to preload script
    },
    autoHideMenuBar: true, // Hide the menu bar
    titleBarStyle: "hidden", // Hide the title bar
  });

  // Load the main window content
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // If a dev server URL is provided, load it
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Otherwise, load the index.html from the file system
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();
  openDevToolsWithShortcut(mainWindow);
}

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
    const widgetsData: WidgetsConfig = JSON.parse(
      getWidgetsJson(widgetsJsonPath)
    );
    if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
      console.error("Unexpected widgets data structure:", widgetsData);
      return;
    }
    // Iterate through each widget in the data
    Object.entries(widgetsData).forEach(([key, widget]) => {
      // Check if the widget is set to be visible
      if (widget.visible) {
        // Generate random positions if none are defined
        if (!widget.positionX && !widget.positionY) {
          widget.positionX = Math.floor(Math.random() * 100);
          widget.positionY = Math.floor(Math.random() * 100);
          widgetsData[key] = widget;
          // Update the widgets.json file with new positions
          writeFileSync(
            path.join(__dirname, "/widgets/widgets.json"),
            JSON.stringify(widgetsData, null, 2)
          );
        }
        try {
          // Create a new browser window for the widget
          const win = new BrowserWindow({
            width: widget.width,
            height: widget.height,
            autoHideMenuBar: widget.autoHideMenuBar,
            titleBarStyle: widget.titleBarStyle,
            transparent: widget.transparent,
            resizable: widget.resizable,
            x: widget.positionX,
            y: widget.positionY,
            webPreferences: {
              contextIsolation: false,
              nodeIntegration: true,
            },
          });

          // Load the widget's HTML file into the window
          const indexPath = path.join(widgetsDir, key, "index.html");
          console.log(`Loading ${indexPath}`);
          win.loadFile(indexPath);
          openDevToolsWithShortcut(win);
        } catch (err) {
          console.error(`Error creating window for ${key}: ${err}`);
        }
      }
    });
  } catch (err) {
    console.error(`Error parsing widgets data: ${err}`);
  }
}
