import { BrowserWindowConstructorOptions } from "electron";

export const preset: WidgetConfig & BrowserWindowConstructorOptions = {
  title: `Widget Window - ${Math.floor(Math.random() * 1000)}`,
  visible: true,
  locked: false,
  created_at: new Date().toISOString(),
  creator: "Anonymous",
  width: 300,
  height: 130,
  transparent: true,
  autoHideMenuBar: true,
  titleBarStyle: "hidden",
  resizable: true,
  maximizable: false,
  minimizable: false,
  skipTaskbar: true,
  thickFrame: false,
  frame: false,
  hasShadow: false,
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: true,
  },
  closable: true,
  x: 10,
  y: 10,
};
