import { dialog, ipcMain } from 'electron'
import { IpcChannels } from '../../../lib/ipc-channels'
import { createSingleWindowForWidgets, windowManager } from '../../../utils'

/**
 * Handles the creation of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.CREATE_WIDGET_WINDOW, (event, key) => {
  createSingleWindowForWidgets(key)
})

/**
 * Handles the closing of a widget window.
 * @param event - The event object.
 * @param key - The key of the widget.
 */
ipcMain.handle(IpcChannels.CLOSE_WIDGET_WINDOW, (event, key) => {
  try {
    windowManager.getAllWindowsExceptMain().forEach((win) => {
      if (win.title === key) win.close()
    })
  } catch (error) {
    console.error('Error closing widget window:', error)
    dialog.showErrorBox('Error closing widget window', `${error}`)
  }
})
