// filepath: c:\Users\samet\SWProjects\electron-widgets\src\app\preload\api\app-operations.ts
import { ipcRenderer } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'

export const appOperationsAPI = {
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
  getAppVersion: () => ipcRenderer.invoke(IpcChannels.GET_APP_VERSION)
}
