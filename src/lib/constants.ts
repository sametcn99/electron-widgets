import { BrowserWindow } from "electron";
import path from "node:path";
import { homedir } from "os";

// Define the source widgets directory
export const sourceWidgetsDir = path.join(__dirname, "widgets");

// Define the widgets directory on the desktop
export const widgetsDir = path.join(homedir(), "electron-widgets");

// Define the path to the widgets.json file
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");

// Create a map to store the browser windows
export const windowsMap = new Map<string, BrowserWindow>();

// Define the path to the electron.png icon
export const iconPath = path.join(__dirname, "assets", "electron.png");

export const applicationName: string = "Electron Widgets";
