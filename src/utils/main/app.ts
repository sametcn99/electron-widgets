import { app, BrowserWindow, Menu, nativeImage, screen, Tray } from "electron";
import { createWindowsForWidgets } from "../browser-windows/widget-windows";
import { iconPath, sourceWidgetsDir, widgetsDir } from "../../lib/constants";
import { copyWidgetsDirIfNeeded, getDiskUsage } from "../utils";
import { registerMainIPC } from "./ipc";
import is from "electron-is";
import { createWindow } from "../browser-windows/main-window";
import { getMainWindow } from "../browser-windows/utils";
let tray;

/**
 * Registers the Electron app and sets up necessary event handlers and functionality.
 * This function should be called to initialize the Electron app.
 */
export function registerApp() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    copyWidgetsDirIfNeeded(sourceWidgetsDir, widgetsDir);
    createWindow();
    createWindowsForWidgets();
    getDiskUsage();

    // buildVueProject(vuePath)
    //   .then(() => {
    //     console.log("Vue project built successfully");
    //   })
    //   .catch((err) => {
    //     console.error("Vue project build failed", err);
    //   });

    // Create tray icon
    const pixelRatio = is.windows()
      ? screen.getPrimaryDisplay().scaleFactor || 1
      : 1;

    const trayIcon = nativeImage.createFromPath(iconPath).resize({
      width: 16 * pixelRatio,
      height: 16 * pixelRatio,
    });

    tray = new Tray(trayIcon);
    // Create tray context menu
    const contextMenu = Menu.buildFromTemplate([
      { label: "Open", click: () => createWindow() },
      { label: "Quit", click: () => app.quit() },
    ]);

    tray.setToolTip("Electron Widgets");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
      getMainWindow()?.show();
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  registerMainIPC();
}
