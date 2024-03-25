/* eslint-disable no-undef */
import { app, BrowserWindow, ipcMain } from 'electron';
const path = require('node:path');
import { readFileSync, writeFile, writeFileSync } from 'node:fs';
// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and import them here.

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/**
 * Creates the main browser window.
 *
 * Sets up the window with default dimensions and preferences. Loads either
 * the local dev server URL or built HTML file depending on environment.
 * Also opens the DevTools for development.
 */
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 450,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  createWindowsForWidgets()

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




/**
 * Creates windows for widgets defined in the widgets.json file.
 *
 * Parses the widgets data and creates a BrowserWindow for each widget
 * that has the "visible" property set to true. If no "positionX" or
 * "positionY" is defined, it will generate random values and update
 * the widgets.json file.
 */
function createWindowsForWidgets() {
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
            JSON.stringify(widgetsData, null, 2),
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
})

/**
 * Handles the 'close-window' IPC message by closing the focused window.
 * When the 'close-window' message is received, this gets the currently focused
 * BrowserWindow instance and calls win.close() to close the window.
 */
ipcMain.handle("close-window", () => {
  const win = BrowserWindow.getFocusedWindow();
  win.close();
})


/**
 * Handles the 'read-widgets-json' IPC message by returning the contents of the
 * widgets.json file.
 *
 * When the message is received, this function reads the widgets.json file
 * located in the widgets directory and returns its contents as a string.
 */
ipcMain.handle("read-widgets-json", () => {
  const filePath = path.join(__dirname, "/widgets/widgets.json");
  let widgetsData = readFileSync(
    filePath,
    "utf-8",
  );
  return widgetsData;
});

/**
 * Handles the 'write-widgets-json' IPC message by writing data to the widgets.json file.
 * Writes the provided data to widgets.json in the app directory and also to public/widgets/widgets.json.
 * Catches any errors writing and logs them.
 */
ipcMain.handle("write-widgets-json", async (event, data) => {
  try {
    const filePath = path.join(__dirname, "/widgets/widgets.json");
    console.log("Writing to widgets.json:", filePath);
    console.log("Writing to widgets.json:", "public/widgets/widgets.json");
    await writeFile(filePath, data, (err) => {
      if (err) {
        console.error(`Error writing to widgets.json: ${err}`);
        return;
      }
      console.log('Data has been written to widgets.json');
    });
    await writeFile("public/widgets/widgets.json", data, (err) => {
      if (err) {
        console.error(`Error writing to public/widgets/widgets.json: ${err}`);
        return;
      }
      console.log('Data has been written to public/widgets/widgets.json');
    });
  } catch (err) {
    console.error(`Error writing to widgets.json:`, err);
  }
});

/**
 * Gets the widget JSON data from the widgets.json file
 * Reads the widgets.json configuration file located in the widgets directory
 * and returns its contents as a string.
 */
function getWidgetJson() {
  try {
    const filePath = path.join(__dirname, "/widgets/widgets.json");
    const widgetsData = readFileSync(filePath, "utf-8");
    return widgetsData;
  } catch (error) {
    console.error("Failed to read widgets.json:", error);
    throw error; // Rethrow the error after logging it
  }
}
