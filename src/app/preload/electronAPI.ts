import { contextBridge, ipcRenderer } from "electron";
import { IpcChannels } from "../../lib/ipc-channels";

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // custom data operations
  readCustomData: (widgetKey: string, filePath: string) =>
    ipcRenderer.invoke(IpcChannels.READ_CUSTOM_DATA, widgetKey, filePath),
  writeCustomData: (widgetKey: string, filePath: string, data: string) => {
    ipcRenderer.invoke(
      IpcChannels.WRITE_CUSTOM_DATA,
      widgetKey,
      filePath,
      data,
    );
  },

  // widget data operations
  readWidgetsJson: () => ipcRenderer.invoke(IpcChannels.READ_WIDGETS_JSON),
  writeWidgetJson: (data: string) =>
    ipcRenderer.invoke(IpcChannels.WRITE_WIDGETS_JSON, data),
  removeWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.REMOVE_WIDGET, widgetId),
  sortWidgets: () => ipcRenderer.invoke(IpcChannels.SORT_WIDGETS),
  duplicateWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.DUPLICATE_WIDGET, widgetId),

  // widget window operations
  createWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CREATE_WIDGET_WINDOW, widgetKey),
  closeWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CLOSE_WIDGET_WINDOW, widgetKey),
  minimizeWindow: () =>
    ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "minimize"),
  closeWindow: () => ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "close"),

  // widget visibility operations
  showAllWidgets: () => ipcRenderer.invoke(IpcChannels.SHOW_ALL_WIDGETS),
  showWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.SHOW_WIDGET, widgetId),
  reloadWidget: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.RELOAD_WIDGET, widgetKey),
  recreateWidget: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.RECREATE_WIDGET, widgetKey),
  lockWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.LOCK_WIDGET, widgetId),
  setAlwaysOnTop: (widgetId: string, alwaysOnTop: boolean) => {
    ipcRenderer.invoke(IpcChannels.SET_ALWAYS_ON_TOP, widgetId, alwaysOnTop);
  },
  setLockAllWidgets: (lock: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_LOCK_ALL_WIDGETS, lock),
  setVisibilityAllWidgets: (visible: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_VISIBILITY_ALL_WIDGETS, visible),

  // app operations
  addWidget: () => ipcRenderer.invoke(IpcChannels.ADD_WIDGET_DIALOG),
  revealWidgetsFolder: () =>
    ipcRenderer.invoke(IpcChannels.REVEAL_WIDGETS_FOLDER),
  openExternal: (path: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL, path),
  getDiskUsage: () => ipcRenderer.invoke(IpcChannels.GET_DISK_USAGE),
  getSystemInfo: async () => ipcRenderer.invoke(IpcChannels.SYSTEM_INFO),
  getLocation: async () => ipcRenderer.invoke(IpcChannels.GET_LOCATION),
  showNotification: (title: string, body: string) =>
    ipcRenderer.invoke(IpcChannels.SHOW_NOTIFICATION, title, body),
  getRSSFeed: (url: string) =>
    ipcRenderer.invoke(IpcChannels.RSS_FEED_PARSER, url),
  opmlToJson: (xml: string) =>
    ipcRenderer.invoke(IpcChannels.OPML_TO_JSON, xml),
  getAppVersion: () => ipcRenderer.invoke(IpcChannels.GET_APP_VERSION),
});
