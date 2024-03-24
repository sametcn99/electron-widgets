/* eslint-disable no-undef */
/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


const { contextBridge, ipcRenderer } = require('electron/renderer')
window.addEventListener('DOMContentLoaded', () => {
})


/**
 * Exposes Electron APIs to the renderer process via contextBridge.
 * This makes the minimizeWindow and closeWindow functions available
 * in the global namespace of the renderer process.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  readWidgetsJSON: () => ipcRenderer.invoke("read-widgets-json"),
});
