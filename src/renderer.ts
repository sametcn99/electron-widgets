// renderer.js
/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupWindowControls();
  //dragWindow();
});

/**
 * Handles dragging of the window by tracking mouse events on the title bar element.
 * Listens for mousedown events to initiate dragging, tracks mousemove events to
 * update the window position during dragging, and listens for mouseup to stop dragging.
 */
// function dragWindow() {
//   const titleBar = document.getElementById("drag-region");
//   let isDragging = false;
//   let offsetX: number, offsetY: number;

//   // Listen for the mouse down event on the title bar to initiate dragging
//   titleBar.addEventListener("mousedown", (e) => {
//     isDragging = true;
//     offsetX = e.clientX - window.screenX;
//     offsetY = e.clientY - window.screenY;
//     console.log(`dragging started at ${window.screenX}, ${window.screenY}`);
//   });

//   // Track mouse movement to handle window dragging
//   window.addEventListener("mousemove", (e) => {
//     if (isDragging === false) return;
//     const { screenX, screenY } = e;
//     // window.moveTo(screenX - offsetX, screenY - offsetY)
//     window.moveBy(e.movementX, e.movementY);
//     console.log(`moved to ${screenX - offsetX}, ${screenY - offsetY}`);
//   });

//   // Stop dragging when mouse button is released
//   window.addEventListener("mouseup", () => {
//     isDragging = false;
//     console.log(`dragging stopped`);
//   });
// }

/**
 * Sets up click event handlers for the window control buttons to minimize and close the window.
 */
function setupWindowControls() {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");
  if (minimizeBtn && closeBtn) {
    minimizeBtn.addEventListener("click", () => {
      window.electronAPI.minimizeWindow();
    });

    closeBtn.addEventListener("click", () => {
      window.electronAPI.closeWindow();
    });
  }
}
