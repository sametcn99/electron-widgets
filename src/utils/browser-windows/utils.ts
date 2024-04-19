import { BrowserWindow, dialog } from "electron";
import { applicationName } from "../../lib/constants";
import { createWindowsForWidgets } from "./widget-windows";

/**
 * Retrieves the main Electron BrowserWindow instance.
 * @returns The main Electron BrowserWindow instance, or undefined if not found.
 */
export const getMainWindow = (): Electron.BrowserWindow | undefined => {
  try {
    let mainWindow: Electron.BrowserWindow | undefined;
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() === applicationName) {
        mainWindow = win;
      }
    });
    return mainWindow;
  } catch (error) {
    console.error("Error getting main window:", error);
    dialog.showErrorBox("Error getting main window", `${error}`);
  }
};

/**
 * Minimizes all open windows except for the main window.
 */
export const minimizeAllWindowsExceptMain = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        win.minimize();
      }
    });
  } catch (error) {
    console.error("Error minimizing windows:", error);
    dialog.showErrorBox("Error minimizing windows", `${error}`);
  }
};

/**
 * Closes all open windows except for the main window.
 */
export const closeAllWindowsExceptMain = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        win.close();
      }
    });
  } catch (error) {
    console.error("Error closing windows:", error);
    dialog.showErrorBox("Error closing windows", `${error}`);
  }
};

/**
 * Reloads all widget windows.
 * Closes all windows except for the main window and recreates
 * the windows for all widgets defined in the widgets.json file.
 */
export function reloadAllWidgets() {
  closeAllWindowsExceptMain();
  createWindowsForWidgets();
}

/**
 * Closes all open windows.
 */
export const closeAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.close();
    });
  } catch (error) {
    console.error("Error closing windows:", error);
    dialog.showErrorBox("Error closing windows", `${error}`);
  }
};

/**
 * Minimizes all open windows.
 */
export const minimizeAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.minimize();
    });
  } catch (error) {
    console.error("Error minimizing windows:", error);
    dialog.showErrorBox("Error minimizing windows", `${error}`);
  }
};

/**
 * Restores all minimized windows to their original state.
 */
export const restoreAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.restore();
    });
  } catch (error) {
    console.error("Error restoring windows:", error);
    dialog.showErrorBox("Error restoring windows", `${error}`);
  }
};

/**
 * Toggles the Developer Tools for all open windows.
 */
export const toggleDevToolsAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.toggleDevTools();
    });
  } catch (error) {
    console.error("Error toggling DevTools:", error);
    dialog.showErrorBox("Error toggling DevTools", `${error}`);
  }
};

/**
 * Reloads all open windows.
 */
export const reloadAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.reload();
    });
  } catch (error) {
    console.error("Error reloading windows:", error);
    dialog.showErrorBox("Error reloading windows", `${error}`);
  }
};

/**
 * Shows all hidden windows.
 */
export const showAllWindows = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.show();
    });
  } catch (error) {
    console.error("Error showing windows:", error);
    dialog.showErrorBox("Error showing windows", `${error}`);
  }
};

/**
 * Hides all windows except for the main window.
 */
export const hideAllWindowsExceptMain = (): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        win.hide();
      }
    });
  } catch (error) {
    console.error("Error hiding windows:", error);
    dialog.showErrorBox("Error hiding windows", `${error}`);
  }
};

/**
 * Sets the "always on top" property for all windows except for the main window.
 *
 * @param alwaysOnTop Whether to set the "always on top" property to true or false.
 */
export const setAlwaysOnTopAllWindowsExceptMain = (
  alwaysOnTop: boolean,
): void => {
  try {
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        win.setAlwaysOnTop(alwaysOnTop);
      }
    });
  } catch (error) {
    console.error("Error setting always on top:", error);
    dialog.showErrorBox("Error setting always on top", `${error}`);
  }
};

/**
 * Retrieves all browser windows except the main window.
 * @returns An array of BrowserWindow instances representing the windows.
 */
export const getAllWindowsExceptMain = (): BrowserWindow[] => {
  try {
    const windows: BrowserWindow[] = [];
    BrowserWindow.getAllWindows().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        windows.push(win);
      }
    });
    return windows;
  } catch (error) {
    console.error("Error getting windows:", error);
    dialog.showErrorBox("Error getting windows", `${error}`);
    return [];
  }
};
