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
