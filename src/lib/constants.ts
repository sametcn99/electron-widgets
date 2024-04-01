import path from "node:path";
import { homedir } from "os";

// Define the application name
export const applicationName: string = "Electron Widgets";

// Define the source widgets directory
export const sourceWidgetsDir = path.join(__dirname, "widgets");

// Define the widgets directory on the desktop
export const widgetsDir = path.join(homedir(), "electron-widgets");

// Define the path to the widgets.json file
export const widgetsJsonPath = path.join(widgetsDir, "widgets.json");

// Define the path to the electron.png icon
export const iconPath = path.join(__dirname, "assets", "electron.png");

// Define the home path
export const homePath: string = path.join(homedir());

// Enum defining IPC channels
export enum IpcChannels {
  WINDOW_ACTION = "window-action", // Channel for window actions
  READ_WIDGETS_JSON = "read-widgets-json", // Channel for reading widgets JSON
  WRITE_WIDGETS_JSON = "write-widgets-json", // Channel for writing widgets JSON
  CREATE_WIDGET_WINDOW = "create-widget-window", // Channel for creating widget windows
  CLOSE_WIDGET_WINDOW = "close-widget-window", // Channel for closing widget windows
  OPEN_EXTERNAL_LINK = "open-external-link", // Channel for opening external links
  GET_DISK_USAGE = "get-disk-usage", // Channel for opening external links
  OPEN_DIRECTORY = "dialog:openDirectory", // Channel for opening file dialog
  SHOW_ALL_WIDGETS = "show-all-widgets", // Channel for showing all widgets
  RESIZE_WIDGET_WINDOW = "resize-widget-window", // Channel for resizing widget windows
  DRAG_WIDGET_WINDOW = "drag-widget-window", // Channel for dragging widget windows
  ADD_WIDGET_DIALOG = "add-widget-dialog", // Channel for adding a widget dialog
}
