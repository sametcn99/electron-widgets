// types.d.ts

// Basic Widget Configuration
type WidgetConfig = {
  title: string
  visible: boolean
  width: number
  height: number
  x: number
  y: number
  locked: boolean
  alwaysOnTop: boolean
}

// Collection of Widget Configurations
type WidgetsConfig = {
  [key: string]: WidgetConfig
}

// Drive Information (assuming Drive type exists elsewhere or needs definition)
// Define Drive type if not already defined
// Example:
// type Drive = {
//   filesystem: string;
//   blocks: number;
//   used: number;
//   available: number;
//   capacity: string;
//   mounted: string;
// };

// RSS Feed Structure (assuming RSSFeed type exists elsewhere or needs definition)
// Define RSSFeed type if not already defined
// Example:
// type RSSFeedItem = { title?: string; link?: string; pubDate?: string; content?: string; guid?: string; };
// type RSSFeed = { items: RSSFeedItem[]; title?: string; description?: string; link?: string; };

// OPML to JSON Result (assuming opmlToJsonResult type exists elsewhere or needs definition)
// Define opmlToJsonResult type if not already defined
// Example:
// type opmlToJsonResult = { /* structure of the JSON result */ };

// Custom Data Structure (assuming CustomData type exists elsewhere or needs definition)
// Define CustomData type if not already defined
// Example:
// type CustomData = Record<string, any> | string; // Or a more specific type

// System Information (assuming Systeminformation types are imported or defined)
// Ensure Systeminformation is imported or types are defined globally
// import * as Systeminformation from 'systeminformation';
type SystemInfo = Systeminformation.StaticData & Systeminformation.DynamicData

// API Interfaces
interface WindowActionsAPI {
  minimizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

interface ExternalLinksAPI {
  openExternal: (url: string) => Promise<void>
}

interface WidgetConfigAPI {
  readWidgetsJson: () => Promise<WidgetsConfig>
  writeWidgetJson: (data: WidgetsConfig) => Promise<void>
}

interface WidgetWindowAPI {
  createWidgetWindow: (widgetKey: string) => Promise<void>
  closeWidgetWindow: (widgetKey: string) => Promise<void>
}

interface DiskUsageAPI {
  getDiskUsage: () => Promise<Drive[]> // Ensure Drive type is defined/imported
}

interface WidgetManagementAPI {
  addWidget: () => Promise<void>
  removeWidget: (widgetKey: string) => Promise<void>
  redownloadWidgetsFolder: () => Promise<void>
}

interface SystemInfoAPI {
  getSystemInfo: () => Promise<SystemInfo> // Ensure SystemInfo type is defined/imported
}

interface WidgetActionsAPI {
  reloadWidget: (widgetKey: string) => Promise<void>
  recreateWidget: (widgetKey: string) => Promise<void>
  duplicateWidget: (widgetKey: string) => Promise<void>
  lockWidget: (widgetId: string) => Promise<void>
  getLocation: () => Promise<void> // Consider renaming for clarity if it gets location data, e.g., getUserLocation
  showNotification: (title: string, body?: string) => Promise<void>
  getRSSFeed: (url: string) => Promise<RSSFeed> // Ensure RSSFeed type is defined/imported
  opmlToJson: (xml: string) => Promise<opmlToJsonResult> // Ensure opmlToJsonResult type is defined/imported
  showAllWidgets: () => Promise<void>
  revealWidgetsFolder: () => Promise<void>
  getAppVersion: () => Promise<string>
  setLockAllWidgets: (lock: boolean) => Promise<void>
  setVisibilityAllWidgets: (visible: boolean) => Promise<void>
  sortWidgets: () => Promise<void>
  setAlwaysOnTop: (widgetId: string, alwaysOnTop: boolean) => Promise<void>
  showWidget: (widgetId: string) => Promise<void>
}

interface CustomDataAPI {
  readCustomData: (widgetKey: string, filePath: string) => Promise<string>
  writeCustomData: (
    widgetKey: string,
    filePath: string,
    data: CustomData // Ensure CustomData type is defined/imported
  ) => Promise<void>
}

// Combined Electron API
interface ElectronAPI
  extends WindowActionsAPI,
    ExternalLinksAPI,
    WidgetConfigAPI,
    WidgetWindowAPI,
    DiskUsageAPI,
    WidgetManagementAPI,
    SystemInfoAPI,
    WidgetActionsAPI,
    CustomDataAPI {}

// Global Window Type Augmentation
// No need to redeclare 'Window' if it's already globally available
// Use 'declare global' to augment the existing global scope
interface Window {
  electronAPI: ElectronAPI
}

// Export types if this file is treated as a module by your TypeScript configuration
// export type { WidgetConfig, WidgetsConfig, ElectronAPI, /* other needed exports */ };
