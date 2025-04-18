import { contextBridge } from 'electron'
import { appOperationsAPI } from './api/app-operations'
import { customDataAPI } from './api/custom-data'
import { widgetDataAPI } from './api/widget-data'
import { widgetVisibilityAPI } from './api/widget-visibility'
import { widgetWindowAPI } from './api/widget-window'

/**
 * Exposes Electron API to the main world.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  ...customDataAPI,
  ...widgetDataAPI,
  ...widgetWindowAPI,
  ...widgetVisibilityAPI,
  ...appOperationsAPI
})
