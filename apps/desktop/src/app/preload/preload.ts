/**
 * This file serves as the preload script for the Electron application.
 * It imports necessary modules and sets up event listeners for the window.
 */

import { IpcChannels } from '../../lib/ipc-channels'
import { ipcRenderer } from 'electron'
import './electronAPI'

window.addEventListener('DOMContentLoaded', async () => {
  // Get the window title (widget key) once on load
  const getWidgetKey = async () => {
    try {
      return await ipcRenderer.invoke('get-window-title')
    } catch (error) {
      console.error('Error getting window title:', error)
      return null
    }
  }

  let widgetKey: string | null = null

  // Get widget key after a short delay to ensure window is fully initialized
  setTimeout(async () => {
    widgetKey = await getWidgetKey()
  }, 100)

  // Add an event listener to handle window resize events
  let resizeTimeout: NodeJS.Timeout
  window.addEventListener('resize', async () => {
    try {
      // Debounce resize events
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(async () => {
        if (widgetKey) {
          await ipcRenderer.invoke(IpcChannels.RESIZE_WIDGET_WINDOW, widgetKey)
        }
      }, 100)
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error('Error resizing window:', error)
    }
  })

  // Add an event listener to handle window drag events
  // Track if window is being dragged
  let isDragging = false

  window.addEventListener('mousedown', () => {
    isDragging = true
  })

  window.addEventListener('mouseup', async () => {
    if (isDragging && widgetKey) {
      try {
        await ipcRenderer.invoke(IpcChannels.DRAG_WIDGET_WINDOW, widgetKey)
      } catch (error) {
        console.error('Error saving window position:', error)
      }
    }
    isDragging = false
  })
})
