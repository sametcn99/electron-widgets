import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "../lib/channels/ipc-channels";

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // WIDGET JSON OPERATIONS-----------------------------------------------------
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
  //---------------------------------------------------------------------------
  // WINDOW OPERATIONS---------------------------------------------------------
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
  //---------------------------------------------------------------------------
  // APP OPERATIONS------------------------------------------------------------
  /**
   * Opens a dialog to add a new widget.
   * @returns A promise that resolves when the operation is complete.
   */
  addWidget: () => ipcRenderer.invoke(IpcChannels.ADD_WIDGET_DIALOG),

  /**
   * Opens an external link in the default browser.
   * @param url - The URL to open.
   * @returns A promise that resolves when the operation is complete.
   */
  openExternalLink: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_LINK, url),

  /**
   * Opens an external app.
   * @param url - The URL of the app to open.
   * @returns A promise that resolves when the operation is complete.
   */
  openExternalApp: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_APP, url),

  /**
   * Retrieves the disk usage information.
   * @returns A promise that resolves with the disk usage information.
   */
  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),
});
