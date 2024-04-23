// types.d.ts
interface WidgetConfig {
  title: string;
  visible: boolean;
  created_at: string;
  creator: string;
  width: number;
  height: number;
  x: number;
  y: number;
  locked: boolean;
  resizable: boolean;
}

// Assuming widgetsData is an object where each key is a string and the value is a WidgetConfig
interface WidgetsConfig {
  [key: string]: WidgetConfig;
}

interface Window {
  electronAPI: {
    minimizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;
    openExternalLink: (url: string) => Promise<void>;
    readWidgetsJson: () => Promise<WidgetsConfig>;
    writeWidgetJson: (data: WidgetsConfig) => Promise<void>;
    createWidgetWindow: (widgetKey: string) => Promise<void>;
    closeWidgetWindow: (widgetKey: string) => Promise<void>;
    getDiskUsage: () => Promise<Drive[]>;
    addWidget: () => Promise<void>;
    redownloadWidgetsFolder: () => Promise<void>;
    openExternalApp: (url: string) => Promise<void>;
    getSystemInfo: () => Promise<
      Systeminformation.StaticData & Systeminformation.DynamicData
    >;
    reloadWidget: () => Promise<void>;
    lockWidget: (widgetId: string) => Promise<void>;
    getLocation: () => Promise<void>;
    showNotification: (title: string, body?: string) => Promise<void>;
  };
  withoutContextApi: {
    openExternalLink: (url: string) => Promise<void>;
    openExternalApp: (url: string) => Promise<void>;
  };
}
