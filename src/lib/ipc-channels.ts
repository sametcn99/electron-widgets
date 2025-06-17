// Enum defining IPC channels
export enum IpcChannels {
  WINDOW_ACTION = "window-action", // Channel for window actions
  GET_APP_VERSION = "get-app-version", // Channel for getting app version

  READ_CUSTOM_DATA = "read-custom-data", // Channel for reading custom data
  WRITE_CUSTOM_DATA = "write-custom-data", // Channel for writing custom data

  READ_WIDGETS_JSON = "read-widgets-json", // Channel for reading widgets JSON
  WRITE_WIDGETS_JSON = "write-widgets-json", // Channel for writing widgets JSON
  SORT_WIDGETS = "sort-widgets", // Channel for sorting widgets
  SET_LOCK_ALL_WIDGETS = "set-lock-all-widgets", // Channel for setting lock for all widgets
  SET_VISIBILITY_ALL_WIDGETS = "set-visibility-all-widgets", // Channel for setting visibility for all widgets

  CREATE_WIDGET_WINDOW = "create-widget-window", // Channel for creating widget windows
  CLOSE_WIDGET_WINDOW = "close-widget-window", // Channel for closing widget windows

  REVEAL_WIDGETS_FOLDER = "dialog:revealWidgetsFolder", // Channel for opening file dialog

  SHOW_WIDGET = "show-widget", // Channel for showing widgets
  SHOW_ALL_WIDGETS = "show-all-widgets", // Channel for showing all widgets
  DUPLICATE_WIDGET = "duplicate-widget", // Channel for duplicating widgets
  RELOAD_WIDGET = "reload-widget", // Channel for refreshing widgets
  RECREATE_WIDGET = "recreate-widget", // Channel for recreating widgets
  RESIZE_WIDGET_WINDOW = "resize-widget-window", // Channel for resizing widget windows
  DRAG_WIDGET_WINDOW = "drag-widget-window", // Channel for dragging widget windows
  ADD_WIDGET_DIALOG = "add-widget-dialog", // Channel for adding a widget dialog
  REMOVE_WIDGET = "remove-widget", // Channel for removing a widget dialog
  LOCK_WIDGET = "lock-widget", // Channel for locking widgets
  SET_ALWAYS_ON_TOP = "set-always-on-top", // Channel for setting always on top

  OPEN_EXTERNAL = "open-external", // Channel for opening external links
  SHOW_NOTIFICATION = "show-notification", // Channel for showing notifications
  GET_DISK_USAGE = "get-disk-usage", // Channel for opening external links
  SYSTEM_INFO = "system-info", // Channel for getting system information
  GET_LOCATION = "get-location", // Channel for getting location
  RSS_FEED_PARSER = "rss-feed-parser", // Channel for parse rss feed
  OPML_TO_JSON = "opml-to-json", // Channel for parse opml to json
}
