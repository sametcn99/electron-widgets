// filepath: c:\Users\samet\SWProjects\electron-widgets\src\app\preload\api\widget-visibility.ts
import { ipcRenderer } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'

export const widgetVisibilityAPI = {
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
    ipcRenderer.invoke(IpcChannels.SET_ALWAYS_ON_TOP, widgetId, alwaysOnTop)
  },
  setLockAllWidgets: (lock: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_LOCK_ALL_WIDGETS, lock),
  setVisibilityAllWidgets: (visible: boolean) =>
    ipcRenderer.invoke(IpcChannels.SET_VISIBILITY_ALL_WIDGETS, visible)
}
