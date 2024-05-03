import { BrowserWindow, dialog } from "electron";
import { applicationName } from "../../lib/constants";
import {
  createSingleWindowForWidgets,
  createWindowsForWidgets,
} from "./widget-windows";

class WindowManager {
  getMainWindow(): Electron.BrowserWindow | undefined {
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
  }

  minimizeAllWindowsExceptMain(): void {
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
  }

  closeAllWindowsExceptMain(): void {
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
  }

  reloadAllWidgets(): void {
    this.closeAllWindowsExceptMain();
    createWindowsForWidgets();
  }

  reloadWidget(title: string): void {
    const window = this.getWindowExceptMain(title);
    if (window) {
      window.close();
    }
    createSingleWindowForWidgets(title);
  }

  static closeAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.close();
      });
    } catch (error) {
      console.error("Error closing windows:", error);
      dialog.showErrorBox("Error closing windows", `${error}`);
    }
  }

  minimizeAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.minimize();
      });
    } catch (error) {
      console.error("Error minimizing windows:", error);
      dialog.showErrorBox("Error minimizing windows", `${error}`);
    }
  }

  restoreAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.restore();
      });
    } catch (error) {
      console.error("Error restoring windows:", error);
      dialog.showErrorBox("Error restoring windows", `${error}`);
    }
  }

  toggleDevToolsAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.toggleDevTools();
      });
    } catch (error) {
      console.error("Error toggling DevTools:", error);
      dialog.showErrorBox("Error toggling DevTools", `${error}`);
    }
  }

  reloadAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.reload();
      });
    } catch (error) {
      console.error("Error reloading windows:", error);
      dialog.showErrorBox("Error reloading windows", `${error}`);
    }
  }

  showAllWindows(): void {
    try {
      BrowserWindow.getAllWindows().forEach((win) => {
        win.show();
      });
    } catch (error) {
      console.error("Error showing windows:", error);
      dialog.showErrorBox("Error showing windows", `${error}`);
    }
  }

  hideAllWindowsExceptMain(): void {
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
  }

  setAlwaysOnTopAllWindowsExceptMain(alwaysOnTop: boolean): void {
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
  }

  getAllWindowsExceptMain(): BrowserWindow[] {
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
  }

  getWindowExceptMain(title: string): BrowserWindow | null {
    try {
      let foundWindow: BrowserWindow | null = null;
      this.getAllWindowsExceptMain().forEach((win) => {
        if (win.webContents.getTitle() === title) {
          foundWindow = win;
        }
      });
      return foundWindow;
    } catch (error) {
      console.error("Error getting window:", error);
      dialog.showErrorBox("Error getting window", `${error}`);
      return null;
    }
  }
}
export const windowManager = new WindowManager();
