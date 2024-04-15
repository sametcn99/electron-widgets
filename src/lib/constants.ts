import path from "node:path";
import { homedir } from "os";

// Define the application name
export const applicationName: string = "Electron Widgets";

// Define the source widgets directory
export const sourceWidgetsDir = path.join(__dirname, "widgets");

// Define the widgets directory on the desktop
export const widgetsDir = path.join(homedir(), "electron-widgets");

// Define the path to the widgets.json file
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");

// Define the path to the electron.png icon
export const iconPath = path.join(__dirname, "assets", "electron.png");

// Define the home path
export const homePath: string = path.join(homedir());

export const sourceCodeUrl: string =
  "https://api.github.com/repos/sametcn99/electron-widgets/zipball";

export const appName = "Electron Widgets";
