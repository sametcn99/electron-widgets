import { BrowserWindow } from "electron";
import path from "node:path";
import { showNotification } from "../notification";
import { openDevToolsWithShortcut } from "../utils";
import { applicationName } from "../../lib/constants";

let mainWindow: BrowserWindow | null = null;

/**
 * Creates the main browser window.
 * Sets up the window with default dimensions and preferences. Loads either
 * the local dev server URL or built HTML file depending on environment.
 * Also opens the DevTools for development.
 */
export function createMainWindow() {
  if (mainWindow !== null) {
    mainWindow.show();
    return;
  }
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: applicationName,
    width: 450, // Set the initial width of the window
    height: 650, // Set the initial height of the window
    minHeight: 400,
    minWidth: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Path to preload script
    },
    autoHideMenuBar: true, // Hide the menu bar
    titleBarStyle: "hidden", // Hide the title bar
    fullscreenable: false, // Disable fullscreen
    maximizable: false, // Disable maximize
  });

  // Load the main window content
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // If a dev server URL is provided, load it
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Otherwise, load the index.html from the file system
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (BrowserWindow.getAllWindows().length !== 0) {
      showNotification(
        applicationName,
        "The application is still running in the background.",
      );
    }
  });
  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();
  openDevToolsWithShortcut(mainWindow);
}
