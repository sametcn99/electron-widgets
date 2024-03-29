export interface PresetOptions {
  title: string;
  width: number;
  height: number;
  transparent: boolean;
  autoHideMenuBar: boolean;
  titleBarStyle: "hidden";
  resizable: boolean;
  maximizable: boolean;
  minimizable: boolean;
  skipTaskbar: boolean;
  thickFrame: boolean;
  frame: boolean;
  hasShadow: boolean;
  webPreferences: {
    nodeIntegration: boolean;
    contextIsolation: boolean;
    accessibleTitle: string;
    disableDialogs: boolean;
    devTools: boolean;
    images: boolean;
    javascript: boolean;
    nodeIntegrationInWorker: boolean;
    webSecurity: boolean;
    webviewTag: boolean;
  };
  closable: boolean;
  alwaysOnTop: boolean;
  minHeight: number;
  minWidth: number;
  maxWidth: number;
  maxHeight: number;
  darkTheme: boolean;
  opacity: number;
  show: boolean;
  trafficLightPosition: {
    x: number;
    y: number;
  };
  roundedCorners: boolean;
  titleBarOverlay: {
    color: string;
    symbolColor: string;
  };
  vibrancy: "window";
  x: number;
  y: number;
}

export const preset: PresetOptions = {
  title: `Widget Window - ${Math.random() * 100}`,
  width: 300,
  height: 130,
  transparent: true,
  autoHideMenuBar: false,
  titleBarStyle: "hidden",
  resizable: true,
  maximizable: false,
  minimizable: false,
  skipTaskbar: true,
  thickFrame: false,
  frame: false,
  hasShadow: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: true,
    accessibleTitle: "Widget Window",
    disableDialogs: false,
    devTools: true,
    images: true,
    javascript: true,
    nodeIntegrationInWorker: false,
    webSecurity: true,
    webviewTag: true,
  },
  closable: true,
  alwaysOnTop: false,
  minHeight: 100,
  minWidth: 150,
  maxWidth: 600,
  maxHeight: 500,
  darkTheme: true,
  opacity: 1,
  show: true,
  trafficLightPosition: {
    x: 10,
    y: 10,
  },
  roundedCorners: true,
  titleBarOverlay: {
    color: "#000000",
    symbolColor: "#FFFFFF",
  },
  vibrancy: "window",
  x: 10,
  y: 10,
};
