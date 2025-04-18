import { app, Menu, nativeImage, screen, Tray } from 'electron'
import { createMainWindow, windowManager } from '.'
import { config } from '../lib/config'

let tray

/**
 * Registers the tray icon and sets up the tray functionality.
 */
export function registerTray() {
  // Get the pixel ratio based on the platform
  const pixelRatio = process.platform === 'win32'
    ? screen.getPrimaryDisplay().scaleFactor || 1
    : 1

  // Create a tray icon from the specified path and resize it
  const trayIcon = nativeImage.createFromPath(config.iconPath).resize({
    width: 16 * pixelRatio,
    height: 16 * pixelRatio
  })

  // Create a new tray instance with the tray icon
  tray = new Tray(trayIcon)

  // Create a context menu for the tray
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => createMainWindow() },
    { label: 'Show All', click: () => windowManager.showAllWindows() },
    { label: 'Quit', click: () => app.quit() }
  ])

  // Set the tooltip for the tray
  tray.setToolTip(config.applicationName)

  // Set the context menu for the tray
  tray.setContextMenu(contextMenu)

  // Handle click event on the tray
  tray.on('click', () => {
    createMainWindow()
  })
}
