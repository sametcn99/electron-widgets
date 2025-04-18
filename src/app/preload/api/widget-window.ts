// filepath: c:\Users\samet\SWProjects\electron-widgets\src\app\preload\api\widget-window.ts
import { ipcRenderer } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'

export const widgetWindowAPI = {
  createWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CREATE_WIDGET_WINDOW, widgetKey),
  closeWidgetWindow: (widgetKey: string) =>
    ipcRenderer.invoke(IpcChannels.CLOSE_WIDGET_WINDOW, widgetKey),
  minimizeWindow: () =>
    ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, 'minimize'),
  closeWindow: () => ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, 'close')
}
