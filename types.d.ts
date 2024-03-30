// types.d.ts
declare global {
  interface WidgetConfig {
    title: string;
    visible: boolean;
    created_at: string;
    updated_at: string;
    creator: string;
    width: number;
    height: number;
    autoHideMenuBar: boolean;
    titleBarStyle: "default" | "hidden" | "customButtonsOnHover";
    transparent: boolean;
    resizable: boolean;
    x: number;
    y: number;
    maximizable: boolean;
    minimizable: boolean;
    skipTaskbar: boolean;
    thickFrame: boolean;
    frame: boolean;
    hasShadow: boolean;
    closable: boolean;
    webpreferences: {
      contextIsolation: boolean;
      nodeIntegration: boolean;
    };
    path: string;
    port: number;
  }

  // Assuming widgetsData is an object where each key is a string and the value is a WidgetConfig
  interface WidgetsConfig {
    [key: string]: WidgetConfig;
  }
}
declare global {
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
}

export {};
