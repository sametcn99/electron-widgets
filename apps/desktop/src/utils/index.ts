export { createMainWindow } from './browser-windows/main-window'
export { showNotification, openDevToolsWithShortcut } from './utils'
export {
  getWidgetsJson,
  setWidgetsJson,
  copyWidgetsDirIfNeeded,
} from './widget/widgets-folder'
export {
  createWindowsForWidgets,
  createSingleWindowForWidgets,
} from './browser-windows/widget-windows'
export { windowManager } from './browser-windows/window-manager'
export { mergeWithPreset } from './utils'
export { displayControl } from './display-control'
export { registerTray } from './tray'
