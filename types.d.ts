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
    positionX?: number;
    positionY?: number;
    maximizable: boolean;
    minimizable: boolean;
    skipTaskbar: boolean;
    thickFrame: boolean;
    frame: boolean;
    hasShadow: boolean;
    closable: boolean;
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
    };
  }
}

export {};
