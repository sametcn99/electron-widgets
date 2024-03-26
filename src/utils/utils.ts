import { BrowserWindow } from "electron";
import electronLocalshortcut from "electron-localshortcut";

export function openDevToolsWithShortcut(win: BrowserWindow) {
  electronLocalshortcut.register(win, "F12", () => {
    win.webContents.openDevTools();
  });
}
