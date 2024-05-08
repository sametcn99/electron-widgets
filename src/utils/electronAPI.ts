import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "../lib/channels/ipc-channels";

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
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
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
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

  /**
   * Shows all widgets on the screen.
   * @returns A promise that resolves when the operation is complete.
   */
  showAllWidgets: () => ipcRenderer.invoke(IpcChannels.SHOW_ALL_WIDGETS),

  /**
   * Refreshes a widget.
   * @param widgetId - The ID of the widget to refresh.
   * @returns A promise that resolves when the operation is complete.
   */
  reloadWidget: () => ipcRenderer.invoke(IpcChannels.RELOAD_WIDGET),

  /**
   * Locks a widget.
   * @param widgetId - The ID of the widget to lock.
   * @returns A promise that resolves when the operation is complete.
   */
  lockWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.LOCK_WIDGET, widgetId),

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  // APP OPERATIONS------------------------------------------------------------
  /**
   * Opens a dialog to add a new widget.
   * @returns A promise that resolves when the operation is complete.
   */
  addWidget: () => ipcRenderer.invoke(IpcChannels.ADD_WIDGET_DIALOG),

  /**
   * Opens a dialog to select a directory.
   * @returns A promise that resolves with the selected directory.
   */
  openDirectory: () => ipcRenderer.invoke(IpcChannels.OPEN_DIRECTORY),

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

  /**
   * Retrieves system information.
   * @returns A promise that resolves with the system information.
   */
  getSystemInfo: async () => ipcRenderer.invoke(IpcChannels.SYSTEM_INFO),

  /**
   * Retrieves the user's location.
   * @returns A promise that resolves with the user's location.
   */
  getLocation: async () => ipcRenderer.invoke(IpcChannels.GET_LOCATION),

  /**
   * Shows a notification.
   * @param title - The title of the notification.
   * @param body - The body of the notification.
   * @returns A promise that resolves when the operation is complete.
   */
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke(IpcChannels.SHOW_NOTIFICATION, title, body),

  /**
   * Parses an OPML file to JSON.
   * @param xml - The OPML file to parse.
   */
  getRSSFeed: (url: string) =>
    ipcRenderer.invoke(IpcChannels.RSS_FEED_PARSER, url),

  /**
   * Parses an OPML file to JSON.
   * @param xml - The OPML file to parse.
   * @returns A promise that resolves with the parsed JSON.
   */
  opmlToJson: (xml: string) =>
    ipcRenderer.invoke(IpcChannels.OPML_TO_JSON, xml),
});
