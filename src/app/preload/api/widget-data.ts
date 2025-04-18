// filepath: c:\Users\samet\SWProjects\electron-widgets\src\app\preload\api\widget-data.ts
import { ipcRenderer } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'

export const widgetDataAPI = {
  readWidgetsJson: () => ipcRenderer.invoke(IpcChannels.READ_WIDGETS_JSON),
  writeWidgetJson: (data: string) =>
    ipcRenderer.invoke(IpcChannels.WRITE_WIDGETS_JSON, data),
  removeWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.REMOVE_WIDGET, widgetId),
  sortWidgets: () => ipcRenderer.invoke(IpcChannels.SORT_WIDGETS),
  duplicateWidget: (widgetId: string) =>
    ipcRenderer.invoke(IpcChannels.DUPLICATE_WIDGET, widgetId)
}
