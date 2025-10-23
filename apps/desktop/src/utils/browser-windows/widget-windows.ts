import { BrowserWindow, dialog } from 'electron'
import path from 'node:path'
import { mergeWithPreset, openDevToolsWithShortcut } from '../utils'
import { preset } from '../../lib/preset'
import { config } from '../../lib/config'
import { getWidgetsJson, setWidgetsJson } from '../widget/widgets-folder'
import is from 'electron-is'

/**
 * Creates windows for widgets defined in the widgets.json file.
 * Parses the widgets data and creates a BrowserWindow for each widget
 * that has the "visible" property set to true. If no "positionX" or
 * "positionY" is defined, it will generate random values and update
 * the widgets.json file.
 */
export function createWindowsForWidgets() {
  try {
    // Parse the widgets JSON data
    const widgetsData: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    if (typeof widgetsData !== 'object' || Array.isArray(widgetsData)) {
      dialog.showErrorBox(
        'Error parsing widgets data',
        'Unexpected widgets data structure',
      )
      return
    }
    // Iterate through each widget in the data
    Object.entries(widgetsData).forEach(([key, widget]) => {
      // Merge the widget with the preset values
      widgetsData[key] = mergeWithPreset(widget, preset)
      setWidgetsJson(widgetsData, config.widgetsJsonPath)
      // Check if the widget is set to be visible
      if (widget.visible) {
        createSingleWindowForWidgets(key)
      }
    })
  } catch (err) {
    dialog.showErrorBox(`Error parsing widgets data`, `${err}`)
  }
}

/**
 * Creates a single window for the given widget key.
 * Parses the widgets configuration, checks if the given widget is visible,
 * generates random positions if needed, creates a BrowserWindow instance
 * and loads the widget HTML file into it.
 *
 * @param key - The key of the widget to create a window for
 */
export async function createSingleWindowForWidgets(key: string) {
  try {
    // Parse the widgets JSON data
    const widgetsData: WidgetsConfig = getWidgetsJson(config.widgetsJsonPath)
    if (typeof widgetsData !== 'object' || Array.isArray(widgetsData)) {
      dialog.showErrorBox(
        'Error parsing widgets data',
        'Unexpected widgets data structure',
      )
      return
    }
    // Iterate through each widget in the data
    const widget: WidgetConfig = widgetsData[key]
    // Check if the widget is set to be visible
    if (widget.visible) {
      try {
        // Create a new browser window for the widget
        const win = new BrowserWindow({
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'), // Path to preload script
          },
          width: widget.width,
          height: widget.height,
          autoHideMenuBar: true,
          titleBarStyle: 'hidden',
          transparent: true,
          resizable: widget.locked ? false : true,
          x: widget.x,
          y: widget.y,
          maximizable: false,
          minimizable: true,
          skipTaskbar: true,
          hasShadow: false,
          closable: true,
          alwaysOnTop: widget.alwaysOnTop,
          thickFrame: false,
          movable: !widget.locked,
          icon: config.iconPath,
        })

        // Hide the traffic light buttons (minimize, maximize, close)
        is.macOS() && win.setWindowButtonVisibility(false)

        if (widget.locked) {
          let isEnforcingPosition = false
          const enforceWidgetPosition = () => {
            if (isEnforcingPosition || win.isDestroyed()) {
              return
            }
            isEnforcingPosition = true
            win.setPosition(widget.x, widget.y)
            isEnforcingPosition = false
          }

          win.setMovable(false)
          win.on('will-move', (event) => {
            event.preventDefault()
            enforceWidgetPosition()
          })
          win.on('move', enforceWidgetPosition)
          win.webContents.on('did-finish-load', () => {
            win.webContents.insertCSS(
              `
                * {
                  -webkit-app-region: no-drag !important;
                }
              `.trim(),
            )
          })
        }

        // Load the widget's HTML file into the window
        const indexPath = path.join(config.widgetsDir, key, 'index.html')
        await win.loadFile(indexPath)
        if (win.title !== key) {
          win.setTitle(key)
        }

        if (!widget.locked) {
          let moveTimeout: NodeJS.Timeout | null = null
          const persistWidgetPosition = (x?: number, y?: number) => {
            if (win.isDestroyed()) {
              return
            }
            const targetX = x ?? win.getBounds().x
            const targetY = y ?? win.getBounds().y
            const widgets = getWidgetsJson(config.widgetsJsonPath)
            const currentWidget = widgets[key]
            if (!currentWidget || currentWidget.locked === true) {
              return
            }
            currentWidget.x = targetX
            currentWidget.y = targetY
            setWidgetsJson(widgets, config.widgetsJsonPath)
          }

          const schedulePersist = (bounds?: Electron.Rectangle) => {
            if (moveTimeout) {
              clearTimeout(moveTimeout)
            }
            moveTimeout = setTimeout(() => {
              persistWidgetPosition(bounds?.x, bounds?.y)
            }, 120)
          }

          win.on('move', () => schedulePersist())
          // Windows emits will-move with the future bounds; macOS fires moved after finish.
          win.on('will-move', (_event, newBounds) => schedulePersist(newBounds))
          win.on('moved', () => persistWidgetPosition())
        }

        openDevToolsWithShortcut(win)
      } catch (err) {
        dialog.showErrorBox(`Error creating window for ${key}`, `${err}`)
      }
    }
  } catch (err) {
    dialog.showErrorBox(`Error parsing widgets data`, `${err}`)
  }
}
