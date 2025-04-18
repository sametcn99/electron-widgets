// filepath: c:\Users\samet\SWProjects\electron-widgets\src\app\preload\api\custom-data.ts
import { ipcRenderer } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'

export const customDataAPI = {
  readCustomData: (widgetKey: string, filePath: string) =>
    ipcRenderer.invoke(IpcChannels.READ_CUSTOM_DATA, widgetKey, filePath),
  writeCustomData: (widgetKey: string, filePath: string, data: string) => {
    ipcRenderer.invoke(IpcChannels.WRITE_CUSTOM_DATA, widgetKey, filePath, data)
  }
}
