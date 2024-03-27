// /**
//  * The preload script runs before. It has access to web APIs
//  * as well as Electron's renderer process modules and some
//  * polyfilled Node.js functions.
//  *
//  * https://www.electronjs.org/docs/latest/tutorial/sandbox
//  */
import { IpcChannels } from "./channels/ipc-channels";
import { loadWidgets, setupWindowControls } from "./utils/dom/main-dom";
/**
 * Handles setting up event listeners and initializing UI elements on DOM ready
 */
window.addEventListener("DOMContentLoaded", async () => {
  loadWidgets();
  setupWindowControls();
});

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openExternalLink: (url: string) =>
    ipcRenderer.invoke(IpcChannels.OPEN_EXTERNAL_LINK, url),
});
