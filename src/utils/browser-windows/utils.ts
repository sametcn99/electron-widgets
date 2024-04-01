import { BrowserWindow, dialog } from "electron";
import { applicationName } from "../../lib/constants";

/**
 * Retrieves all open browser windows.
 * @returns An array of BrowserWindow instances representing all open windows.
 */
export const getAllWindows = (): BrowserWindow[] => {
  try {
    return BrowserWindow.getAllWindows();
  } catch (error) {
    console.error("Error getting windows:", error);
    dialog.showErrorBox("Error getting windows", `${error}`);
    return [];
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

/**
 * Retrieves the main Electron BrowserWindow instance.
 * @returns The main Electron BrowserWindow instance, or undefined if not found.
 */
export const getMainWindow = (): Electron.BrowserWindow | undefined => {
  try {
    let mainWindow: Electron.BrowserWindow | undefined;
    getAllWindows().forEach((win) => {
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
 * Closes all open windows.
 */
export const closeAllWindows = (): void => {
  try {
    getAllWindows().forEach((win) => {
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
    getAllWindows().forEach((win) => {
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
    getAllWindows().forEach((win) => {
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
    getAllWindows().forEach((win) => {
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
    getAllWindows().forEach((win) => {
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
    getAllWindows().forEach((win) => {
      win.show();
    });
  } catch (error) {
    console.error("Error showing windows:", error);
    dialog.showErrorBox("Error showing windows", `${error}`);
  }
};

/**
 * Minimizes all open windows except for the main window.
 */
export const minimizeAllWindowsExceptMain = (): void => {
  try {
    getAllWindows().forEach((win) => {
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
 * Hides all windows except for the main window.
 */
export const hideAllWindowsExceptMain = (): void => {
  try {
    getAllWindowsExceptMain().forEach((win) => {
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
    getAllWindowsExceptMain().forEach((win) => {
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
 * Closes all open windows except for the main window.
 */
export const closeAllWindowsExceptMain = (): void => {
  try {
    getAllWindowsExceptMain().forEach((win) => {
      if (win.webContents.getTitle() !== applicationName) {
        win.close();
      }
    });
  } catch (error) {
    console.error("Error closing windows:", error);
    dialog.showErrorBox("Error closing windows", `${error}`);
  }
};
