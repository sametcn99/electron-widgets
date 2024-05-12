import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "../../lib/ipc-channels";

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // widget json operations
  readWidgetsJson: () => ipcRenderer.invoke(IpcChannels.READ_WIDGETS_JSON),
  writeWidgetJson: (data: string) =>
    ipcRenderer.invoke(IpcChannels.WRITE_WIDGETS_JSON, data),

  // widget window operations
  createWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CREATE_WIDGET_WINDOW, widgetKey),
  closeWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CLOSE_WIDGET_WINDOW, widgetKey),
  minimizeWindow: () =>
    ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "minimize"),
  closeWindow: () => ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "close"),
  showAllWidgets: () => ipcRenderer.invoke(IpcChannels.SHOW_ALL_WIDGETS),
  reloadWidget: () => ipcRenderer.invoke(IpcChannels.RELOAD_WIDGET),
  lockWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.LOCK_WIDGET, widgetId),

  // app operations
  addWidget: () => ipcRenderer.invoke(IpcChannels.ADD_WIDGET_DIALOG),
  revealWidgetsFolder: () =>
    ipcRenderer.invoke(IpcChannels.REVEAL_WIDGETS_FOLDER),
  openExternalLink: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_LINK, url),
  openExternalApp: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_APP, url),
  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),
  getSystemInfo: async () => ipcRenderer.invoke(IpcChannels.SYSTEM_INFO),
  getLocation: async () => ipcRenderer.invoke(IpcChannels.GET_LOCATION),
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke(IpcChannels.SHOW_NOTIFICATION, title, body),
  getRSSFeed: (url: string) =>
    ipcRenderer.invoke(IpcChannels.RSS_FEED_PARSER, url),
  opmlToJson: (xml: string) =>
    ipcRenderer.invoke(IpcChannels.OPML_TO_JSON, xml),
  removeWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.REMOVE_WIDGET, widgetId),
  getAppVersion: () => ipcRenderer.invoke(IpcChannels.GET_APP_VERSION),
  sortWidgets: () => ipcRenderer.invoke(IpcChannels.SORT_WIDGETS),
  setLockAllWidgets: (lock: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_LOCK_ALL_WIDGETS, lock),
  setVisibilityAllWidgets: (visible: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_VISIBILITY_ALL_WIDGETS, visible),
});
