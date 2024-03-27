import { ipcRenderer } from "electron";
import { IpcChannels } from "../../channels/ipc-channels";

/**
 * Sets up the window controls by adding event listeners to the minimize and close buttons.
 */
export function setupWindowControls() {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (minimizeBtn && closeBtn) {
    minimizeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "minimize");
    });
    closeBtn.addEventListener("click", () => {
      ipcRenderer.invoke(IpcChannels.WINDOW_ACTION, "close");
    });
  }
}
