// types.d.ts
interface WidgetConfig {
  title: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
  creator: string;
  path: string;
  port: number;
  width: number;
  height: number;
  x: number;
  y: number;
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
  };
  withoutContextApi: {
    openExternalLink: (url: string) => Promise<void>;
  };
}
