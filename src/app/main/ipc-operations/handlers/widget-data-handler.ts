import { BrowserWindow, dialog, shell } from 'electron'
import path from 'node:path'
import { copySync, existsSync, mkdirSync, rmSync } from 'fs-extra'
import { IpcChannels } from '../../../../lib/ipc-channels'
import {
  getWidgetsJson,
  setWidgetsJson,
  createSingleWindowForWidgets,
  windowManager
} from '../../../../utils'
import { config } from '../../../../lib/config'
import { preset } from '../../../../lib/preset'
import { IpcHandlerBase } from './ipc-handler-base'

/**
 * Handles operations related to widget data.
 */
export class WidgetDataHandler extends IpcHandlerBase {
  /**
   * Registers all widget data IPC handlers.
   */
  public register(): void {
    this.registerHandler(
      IpcChannels.READ_WIDGETS_JSON,
      this.handleReadWidgetsJson.bind(this)
    )
    this.registerHandler(
      IpcChannels.WRITE_WIDGETS_JSON,
      this.handleWriteWidgetsJson.bind(this)
    )
    this.registerHandler(
      IpcChannels.REVEAL_WIDGETS_FOLDER,
      this.handleRevealWidgetsFolder.bind(this)
    )
    this.registerHandler(
      IpcChannels.SET_LOCK_ALL_WIDGETS,
      this.handleSetLockAllWidgets.bind(this)
    )
    this.registerHandler(
      IpcChannels.SORT_WIDGETS,
      this.handleSortWidgets.bind(this)
    )
    this.registerHandler(
      IpcChannels.ADD_WIDGET_DIALOG,
      this.handleAddWidgetDialog.bind(this)
    )
    this.registerHandler(
      IpcChannels.REMOVE_WIDGET,
      this.handleRemoveWidget.bind(this)
    )
    this.registerHandler(
      IpcChannels.DUPLICATE_WIDGET,
      this.handleDuplicateWidget.bind(this)
    )
  }

  /**
   * Handles reading the widgets JSON file.
   * @returns The contents of the widgets JSON file.
   */
  private handleReadWidgetsJson(): any {
    return getWidgetsJson(config.widgetsJsonPath)
  }

  /**
   * Handles writing data to the widgets JSON file.
   * @param event - The event object.
   * @param data - The data to write to the widgets JSON file.
   */
  private handleWriteWidgetsJson(
    event: Electron.IpcMainInvokeEvent,
    data: any
  ): void {
    setWidgetsJson(data, config.widgetsJsonPath)
  }

  /**
   * Handles revealing the widgets folder in the file explorer.
   */
  private handleRevealWidgetsFolder(): void {
    shell.showItemInFolder(config.widgetsJsonPath)
  }

  /**
   * Handles setting the lock state of all widgets.
   * @param event - The event object.
   * @param lock - The lock state.
   */
  private handleSetLockAllWidgets(
    event: Electron.IpcMainInvokeEvent,
    lock: boolean
  ): void {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    Object.keys(widgets).forEach((key) => {
      widgets[key].locked = lock
    })
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reloadMainWindow()
    windowManager.reCreateAllWidgets()
  }

  /**
   * Handles sorting the widgets.
   */
  private handleSortWidgets(): void {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    const sortedKeys = Object.keys(widgets).sort()
    const sortedWidgets: { [key: string]: WidgetConfig } = {}
    sortedKeys.forEach((key: string) => {
      sortedWidgets[key] = widgets[key]
    })
    setWidgetsJson(sortedWidgets, config.widgetsJsonPath)
    windowManager.reloadMainWindow()
  }

  /**
   * Handles opening the add widget dialog.
   */
  private async handleAddWidgetDialog(): Promise<void> {
    const mainWindow = BrowserWindow.getFocusedWindow()
    if (mainWindow) {
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'Select a folder to add as a widget.',
        defaultPath: config.homePath
      })
      if (canceled) {
        return
      } else {
        const srcDir = filePaths[0]
        const srcDirName = path.basename(filePaths[0])

        const indexhtml = path.join(filePaths[0], 'index.html')

        if (existsSync(indexhtml)) {
          mkdirSync(path.join(config.widgetsDir, srcDirName), {
            recursive: true
          })

          copySync(
            path.join(srcDir),
            path.join(config.widgetsDir, srcDirName),
            {
              overwrite: true
            }
          )

          if (
            Object.keys(getWidgetsJson(config.widgetsJsonPath)).includes(
              srcDirName
            )
          ) {
            dialog.showMessageBox(mainWindow, {
              type: 'error',
              message: 'Widget already exists.',
              detail: 'The widget is already in the widgets directory.'
            })
            return
          } else {
            const widgetsData = getWidgetsJson(config.widgetsJsonPath)
            widgetsData[srcDirName] = preset
            widgetsData[srcDirName].title = srcDirName
            setWidgetsJson(widgetsData, config.widgetsJsonPath)

            dialog.showMessageBox(mainWindow, {
              type: 'info',
              message: 'Widget added successfully.',
              detail:
                'The widget has been added to the widgets directory and added config to widgets.json file.'
            })
          }
          createSingleWindowForWidgets(srcDirName)
          windowManager.reloadAllWindows()
        } else {
          dialog.showMessageBox(mainWindow, {
            type: 'error',
            message: 'Invalid widget directory.',
            detail:
              'The selected directory does not contain an index.html file.'
          })
        }
      }
    }
  }

  /**
   * Handles removing a widget.
   * @param event - The event object.
   * @param widgetKey - The key of the widget to remove.
   */
  private handleRemoveWidget(
    event: Electron.IpcMainInvokeEvent,
    widgetKey: string
  ): void {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    delete widgets[widgetKey]
    const widgetPath = `${config.widgetsDir}/${widgetKey}`
    rmSync(widgetPath, { recursive: true, force: true })
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reloadAllWindows()
  }

  /**
   * Handles duplicating a widget.
   * @param event - The event object.
   * @param widgetKey - The key of the widget to duplicate.
   */
  private handleDuplicateWidget(
    event: Electron.IpcMainInvokeEvent,
    widgetKey: string
  ): void {
    const widgets = getWidgetsJson(config.widgetsJsonPath)
    const widget = widgets[widgetKey]
    const widgetFolderPath = path.join(config.widgetsDir, widgetKey)
    const randomNumber = Math.floor(Math.random() * 1000)
    const newWidgetId = `${widgetKey}-${randomNumber}`
    const newWidgetFolderPath = path.join(config.widgetsDir, newWidgetId)
    copySync(widgetFolderPath, newWidgetFolderPath)
    widgets[newWidgetId] = { ...widget }
    widgets[newWidgetId].title = newWidgetId
    widgets[newWidgetId].visible = false
    widgets[newWidgetId].x = 10
    widgets[newWidgetId].y = 10
    widgets[newWidgetId].locked = false
    widgets[newWidgetId].alwaysOnTop = false
    setWidgetsJson(widgets, config.widgetsJsonPath)
    windowManager.reloadAllWindows()
  }
}
