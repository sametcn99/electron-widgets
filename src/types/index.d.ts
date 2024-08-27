// types.d.ts
interface WidgetConfig {
  title: string
  visible: boolean
  width: number
  height: number
  x: number
  y: number
  locked: boolean
  alwaysOnTop: boolean
}

// Assuming widgetsData is an object where each key is a string and the value is a WidgetConfig
interface WidgetsConfig {
  [key: string]: WidgetConfig
}

interface Window {
  electronAPI: {
    // Window actions
    minimizeWindow: () => Promise<void>
    closeWindow: () => Promise<void>

    // External links
    openExternal: (url: string) => Promise<void>

    // Widget configuration
    readWidgetsJson: () => Promise<WidgetsConfig>
    writeWidgetJson: (data: WidgetsConfig) => Promise<void>

    // Widget windows
    createWidgetWindow: (widgetKey: string) => Promise<void>
    closeWidgetWindow: (widgetKey: string) => Promise<void>

    // Disk usage
    getDiskUsage: () => Promise<Drive[]>

    // Widget management
    addWidget: () => Promise<void>
    removeWidget: (widgetKey: string) => Promise<void>
    redownloadWidgetsFolder: () => Promise<void>

    // External apps
    openExternal: (url: string) => Promise<void>

    // System information
    getSystemInfo: () => Promise<
      Systeminformation.StaticData & Systeminformation.DynamicData
    >

    // Widget actions
    reloadWidget: (widgetKey: string) => Promise<void>
    recreateWidget: (widgetKey: string) => Promise<void>
    duplicateWidget: (widgetKey: string) => Promise<void>
    lockWidget: (widgetId: string) => Promise<void>
    getLocation: () => Promise<void>
    showNotification: (title: string, body?: string) => Promise<void>
    getRSSFeed: (url: string) => Promise<RSSFeed>
    opmlToJson: (xml: string) => Promise<opmlToJsonResult>
    showAllWidgets: () => Promise<void>
    revealWidgetsFolder: () => Promise<void>
    getAppVersion: () => Promise<string>
    setLockAllWidgets: (lock: boolean) => Promise<void>
    setVisibilityAllWidgets: (visible: boolean) => Promise<void>
    sortWidgets: () => Promise<void>
    setAlwaysOnTop: (widgetId: string, alwaysOnTop: boolean) => Promise<void>
    showWidget: (widgetId: string) => Promise<void>

    // CUSTOM DATA
    readCustomData: (widgetKey: string, filePath: string) => Promise<string>
    writeCustomData: (
      widgetKey: string,
      filePath: string,
      data: CustomData
    ) => Promise<void>
  }
}
