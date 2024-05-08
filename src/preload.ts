/**
 * This file serves as the preload script for the Electron application.
 * It imports necessary modules and sets up event listeners for the window.
 */

import { IpcChannels } from "./lib/channels/ipc-channels";
import { ipcRenderer } from "electron";
import "./utils/electronAPI";

window.addEventListener("DOMContentLoaded", async () => {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  // Add event listeners for minimize and close buttons
  if (minimizeBtn && closeBtn) {
    /**
     * Event listener for the minimize button.
     */
    minimizeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "minimize");
    });

    /**
     * Event listener for the close button.
     */
    closeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "close");
    });
  }

  // Add an event listener to handle window resize events
  window.addEventListener("resize", async () => {
    try {
      /**
       * Event listener for window resize events.
       */
      ipcRenderer.invoke(IpcChannels.RESIZE_WIDGET_WINDOW);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });

  // Add an event listener to handle window drag events
  window.addEventListener("mousemove", () => {
    try {
      /**
       * Event listener for window drag events.
       */
      ipcRenderer.invoke(IpcChannels.DRAG_WIDGET_WINDOW);
    } catch (error) {
      // Log any errors that occur during the drag process
      console.error("Error dragging window:", error);
    }
  });
});
