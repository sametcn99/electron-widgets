const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
import { readFileSync, writeFileSync } from 'node:fs';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createWindowForWidgets()

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


function createWindowForWidgets() {
  try {
    const widgetsData = JSON.parse(getWidgetJson());
    if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
      console.error("Unexpected widgets data structure:", widgetsData);
      return;
    }
    Object.entries(widgetsData).forEach(([key, widget]) => {
      if (widget.visible) {
        if (!widget.positionX && !widget.positionY) {
          // if no position is defined then create a positionX and positionY and write into widgetsData json
          widget.positionX = Math.floor(Math.random() * 100);
          widget.positionY = Math.floor(Math.random() * 100);
          widgetsData[key] = widget;
          writeFileSync(
            path.join(__dirname, "/widgets/widgets.json"),
            JSON.stringify(widgetsData, null, 2)
          );
        }
        try {
          const win = new BrowserWindow({
            width: widget.width,
            height: widget.height,
            autoHideMenuBar: widget.autoHideMenuBar,
            titleBarStyle: widget.titleBarStyle,
            transparent: widget.transparent,
            resizable: widget.resizable,
            x: widget.positionX,
            y: widget.positionY,
          });

          const indexPath = path.join(__dirname, "widgets", key, "index.html");
          console.log(`Loading ${indexPath}`);
          win.loadFile(indexPath);
        } catch (err) {
          console.error(`Error creating window for ${key}: ${err}`);
        }
      }
    });
  } catch (err) {
    console.error(`Error parsing widgets data: ${err}`);
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/**
 * IPC FUNCTIONS
 * Inter-process communication (IPC) is a key part of building feature-rich desktop applications in Electron. 
 * Because the main and renderer processes have different responsibilities in Electron's process model,
 * IPC is the only way to perform many common tasks, such as calling a native API from your UI or 
 * triggering changes in your web contents from native menus.
 */

/**
 * Handles the 'minimize-window' IPC message by minimizing the focused window.
 * When the 'minimize-window' message is received, this gets the currently focused
 * BrowserWindow instance and calls win.minimize() to minimize the window.
 */
ipcMain.handle("minimize-window", () => {
  const win = BrowserWindow.getFocusedWindow();
  win.minimize();
  console.log("Minimized");
})

/**
 * Handles the 'close-window' IPC message by closing the focused window.
 * When the 'close-window' message is received, this gets the currently focused
 * BrowserWindow instance and calls win.close() to close the window.
 */
ipcMain.handle("close-window", () => {
  const win = BrowserWindow.getFocusedWindow();
  win.close();
  console.log("Closed");
})

/**
 * Handles the 'read-widgets-json' IPC message by reading the widgets data
 * from the widgets.json file and returning it.
 */
ipcMain.handle("read-widgets-json", () => {
  return getWidgetJson();
});

/**
 * Reads the widgets data from the widgets.json file and returns it.
 *
 * @returns {string} - The contents of the widgets.json file as a string
 */
function getWidgetJson() {
  const widgetsData = readFileSync(
    path.join(__dirname, "/widgets/widgets.json"),
    "utf-8"
  );
  return widgetsData;
}
