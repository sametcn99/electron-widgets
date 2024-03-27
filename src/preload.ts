/**
 * This file serves as the preload script for the Electron application.
 * It imports necessary modules and sets up event listeners for the window.
 */

import { IpcChannels } from "./channels/ipc-channels";
import { setupWindowControls } from "./utils/dom/main-dom";

window.addEventListener("DOMContentLoaded", async () => {
  setupWindowControls();
});

import { contextBridge, ipcRenderer } from "electron";

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
});
