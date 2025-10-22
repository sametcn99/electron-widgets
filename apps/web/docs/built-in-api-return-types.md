# Built-in API Return Types

The `electronAPI` object extends the `Window` interface and provides a variety of methods for window actions, widget management, system information retrieval, and more. Here are the details of each method and their return types:

## Method Descriptions

### Window Actions

- **minimizeWindow**: Minimizes the current window.
  
  ```typescript
  minimizeWindow: () => Promise<void>;
  ```

- **closeWindow**: Closes the current window.
  
  ```typescript
  closeWindow: () => Promise<void>;
  ```

### External Links

- **openExternal**: Opens an external URL in the default web browser or a file in OS.
  
  ```typescript
  openExternal: (url: string) => Promise<void>;
  ```

### Widget Configuration

- **readWidgetsJson**: Reads the widget configuration from `widgets.json`.
  
  ```typescript
  readWidgetsJson: () => Promise<WidgetsConfig>;
  ```

- **writeWidgetJson**: Writes data to `widgets.json`.
  
  ```typescript
  writeWidgetJson: (data: WidgetsConfig) => Promise<void>;
  ```

### Widget Windows

- **createWidgetWindow**: Creates a new window for a widget.
  
  ```typescript
  createWidgetWindow: (widgetKey: string) => Promise<void>;
  ```

- **closeWidgetWindow**: Closes a widget window.
  
  ```typescript
  closeWidgetWindow: (widgetKey: string) => Promise<void>;
  ```

### Disk Usage

- **getDiskUsage**: Retrieves disk usage information.
  
  ```typescript
  getDiskUsage: () => Promise<Drive[]>;
  ```

### Widget Management

- **addWidget**: Adds a new widget.
  
  ```typescript
  addWidget: () => Promise<void>;
  ```

- **removeWidget**: Removes an existing widget by its key.
  
  ```typescript
  removeWidget: (widgetKey: string) => Promise<void>;
  ```

- **redownloadWidgetsFolder**: Redownloads the widgets folder.
  
  ```typescript
  redownloadWidgetsFolder: () => Promise<void>;
  ```

### System Information

- **getSystemInfo**: Retrieves system information.
  
  ```typescript
  getSystemInfo: () => Promise<Systeminformation.StaticData & Systeminformation.DynamicData>;
  ```

### Widget Actions

- **reloadWidget**: Reloads a widget by its key.
  
  ```typescript
  reloadWidget: (widgetKey: string) => Promise<void>;
  ```

- **lockWidget**: Locks a widget by its ID.
  
  ```typescript
  lockWidget: (widgetId: string) => Promise<void>;
  ```

- **getLocation**: Gets the current location.
  
  ```typescript
  getLocation: () => Promise<void>;
  ```

- **showNotification**: Shows a notification with a title and optional body.
  
  ```typescript
  showNotification: (title: string, body?: string) => Promise<void>;
  ```

- **getRSSFeed**: Fetches an RSS feed from a URL.
  
  ```typescript
  getRSSFeed: (url: string) => Promise<RSSFeed>;
  ```

- **opmlToJson**: Converts OPML XML to JSON.
  
  ```typescript
  opmlToJson: (xml: string) => Promise<opmlToJsonResult>;
  ```

- **showAllWidgets**: Displays all widgets.
  
  ```typescript
  showAllWidgets: () => Promise<void>;
  ```

- **revealWidgetsFolder**: Reveals the widgets folder in the file explorer.
  
  ```typescript
  revealWidgetsFolder: () => Promise<void>;
  ```

- **getAppVersion**: Retrieves the application version.
  
  ```typescript
  getAppVersion: () => Promise<string>;
  ```

- **setLockAllWidgets**: Locks or unlocks all widgets.
  
  ```typescript
  setLockAllWidgets: (lock: boolean) => Promise<void>;
  ```

- **setVisibilityAllWidgets**: Sets the visibility of all widgets.
  
  ```typescript
  setVisibilityAllWidgets: (visible: boolean) => Promise<void>;
  ```

- **sortWidgets**: Sorts the widgets.
  
  ```typescript
  sortWidgets: () => Promise<void>;
  ```

- **setAlwaysOnTop**: Sets whether a widget should always be on top.
  
  ```typescript
  setAlwaysOnTop: (widgetId: string, alwaysOnTop: boolean) => Promise<void>;
  ```

- **showWidget**: Displays a specific widget by its ID.
  
  ```typescript
  showWidget: (widgetId: string) => Promise<void>;
  ```

### Custom Data Management

- **readCustomData**: Reads custom data for a widget from a specified file path.
  
  ```typescript
  readCustomData: (widgetKey: string, filePath: string) => Promise<string>;
  ```

- **writeCustomData**: Writes custom data for a widget to a specified file path.
  
  ```typescript
  writeCustomData: (
    widgetKey: string,
    filePath: string,
    data: CustomData,
  ) => Promise<void>;
  ```

By utilizing these methods, you can interact with various aspects of the application, from managing widget configurations to accessing system information, thus enhancing the functionality and customization of your application.
