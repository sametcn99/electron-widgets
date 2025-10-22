import { BrowserWindow, Notification } from 'electron'
import { register } from 'electron-localshortcut'

/**
 * Merges two widget configurations, with the properties from the `preset` taking precedence over the `source`.
 * @param source - The source widget configuration.
 * @param preset - The preset widget configuration.
 * @returns A new object that is a merge of the `preset` and `source` configurations.
 */
export function mergeWithPreset(
  source: WidgetConfig,
  preset: WidgetConfig,
): WidgetConfig {
  return Object.assign({}, preset, source)
}

/**
 * Registers a keyboard shortcut to open the dev tools when pressing F12.
 * @export
 * @param {BrowserWindow} win - The BrowserWindow instance.
 */
export function openDevToolsWithShortcut(win: BrowserWindow) {
  register(win, 'F12', () => {
    win.webContents.openDevTools()
  })
}

export function showNotification(
  NOTIFICATION_TITLE: string,
  NOTIFICATION_BODY: string = '',
) {
  new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY,
  }).show()
}
