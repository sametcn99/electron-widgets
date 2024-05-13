import { BrowserWindow, dialog, ipcMain } from "electron";
import { IpcChannels } from "../../../lib/ipc-channels";

/**
 * Handles window actions such as minimize and close.
 * @param event - The event object.
 * @param action - The action to perform on the window.
 */
ipcMain.handle(IpcChannels.WINDOW_ACTION, (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    switch (action) {
      case "minimize":
        win.minimize();
        break;
      case "close":
        win.close();
        break;
      default:
        console.log(`Unknown action: ${action}`);
        dialog.showErrorBox("Unknown action", `Unknown action: ${action}`);
        break;
    }
  }
});
