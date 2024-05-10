import { BrowserWindow } from "electron";
import { register } from "electron-localshortcut";

/**
 * Registers a keyboard shortcut to open the dev tools when pressing F12.
 * @export
 * @param {BrowserWindow} win - The BrowserWindow instance.
 */
export function openDevToolsWithShortcut(win: BrowserWindow) {
  register(win, "F12", () => {
    win.webContents.openDevTools();
  });
}
