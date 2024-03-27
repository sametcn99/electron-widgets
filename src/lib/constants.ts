import { BrowserWindow } from "electron";
import path from "node:path";
import { homedir } from "os";

export const sourceWidgetsDir = path.join(__dirname, "widgets");
export const widgetsDir = path.join(homedir(), "Desktop", "widgets");
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");
export const windowsMap = new Map<string, BrowserWindow>();
export const iconPath = path.join(__dirname, "assets", "electron.png");
