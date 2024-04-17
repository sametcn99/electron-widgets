/**
 * This file serves as the preload script for the Electron application.
 * It imports necessary modules and sets up event listeners for the window.
 */

import { IpcChannels } from "./lib/channels/ipc-channels";

window.addEventListener("DOMContentLoaded", async () => {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  // Add event listeners for minimize and close buttons
  if (minimizeBtn && closeBtn) {
    /**
     * Event listener for the minimize button.
     */
    minimizeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "minimize");
    });

    /**
     * Event listener for the close button.
     */
    closeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "close");
    });
  }

  // Add event listener for folder button
  const folderBtn = document.getElementById("open-directory");
  if (folderBtn) {
    /**
     * Event listener for the folder button.
     */
    folderBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.OPEN_DIRECTORY);
    });
  }

  // Add event listener for show all widgets button
  const showAllWidgetsBtn = document.getElementById("show-all-widgets");
  if (showAllWidgetsBtn) {
    /**
     * Event listener for the "Show All Widgets" button.
     */
    showAllWidgetsBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.SHOW_ALL_WIDGETS);
    });
  }

  // Add an event listener to handle window resize events
  window.addEventListener("resize", async () => {
    try {
      /**
       * Event listener for window resize events.
       */
      ipcRenderer.invoke(IpcChannels.RESIZE_WIDGET_WINDOW);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });

  // Add an event listener to handle window drag events
  window.addEventListener("mousemove", () => {
    try {
      /**
       * Event listener for window drag events.
       */
      ipcRenderer.invoke(IpcChannels.DRAG_WIDGET_WINDOW);
    } catch (error) {
      // Log any errors that occur during the drag process
      console.error("Error dragging window:", error);
    }
  });
});

import { contextBridge, ipcRenderer } from "electron";

// preload with contextIsolation disabled
window.withoutContextApi = {
  /**
   * Opens an external link in the default browser.
   * @param url - The URL to open.
   * @returns A promise that resolves when the operation is complete.
   */
  openExternalLink: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_LINK, url),
  openExternalApp: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_APP, url),
};

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Opens an external link in the default browser.
   * @param url - The URL to open.
   * @returns A promise that resolves when the operation is complete.
   */
  openExternalLink: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_LINK, url),

  /**
   * Reads the widgets JSON file.
   * @returns A promise that resolves with the contents of the JSON file.
   */
  readWidgetsJson: () => ipcRenderer.invoke(IpcChannels.READ_WIDGETS_JSON),

  /**
   * Retrieves the disk usage information.
   * @returns A promise that resolves with the disk usage information.
   */
  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),

  /**
   * Writes the widgets JSON file.
   * @param data - The JSON data to write.
   * @returns A promise that resolves when the operation is complete.
   */
  writeWidgetJson: (data: string) =>
    ipcRenderer.invoke(IpcChannels.WRITE_WIDGETS_JSON, data),

  /**
   * Creates a new widget window.
   * @param widgetKey - The key of the widget to create.
   * @returns A promise that resolves when the operation is complete.
   */
  createWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CREATE_WIDGET_WINDOW, widgetKey),

  /**
   * Closes a widget window.
   * @param widgetKey - The key of the widget to close.
   * @returns A promise that resolves when the operation is complete.
   */
  closeWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CLOSE_WIDGET_WINDOW, widgetKey),

  /**
   * Opens a dialog to add a new widget.
   * @returns A promise that resolves when the operation is complete.
   */
  addWidget: () => ipcRenderer.invoke(IpcChannels.ADD_WIDGET_DIALOG),
});
