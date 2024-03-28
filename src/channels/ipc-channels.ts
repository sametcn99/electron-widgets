// Enum defining IPC channels
export enum IpcChannels {
  WINDOW_ACTION = "window-action", // Channel for window actions
  READ_WIDGETS_JSON = "read-widgets-json", // Channel for reading widgets JSON
  WRITE_WIDGETS_JSON = "write-widgets-json", // Channel for writing widgets JSON
  CREATE_WIDGET_WINDOW = "create-widget-window", // Channel for creating widget windows
  CLOSE_WIDGET_WINDOW = "close-widget-window", // Channel for closing widget windows
  OPEN_EXTERNAL_LINK = "open-external-link", // Channel for opening external links
}
