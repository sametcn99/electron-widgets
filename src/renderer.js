// renderer.js
/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

document.addEventListener('DOMContentLoaded', () => {
    setupWindowControls()
    dragWindow()
});

/**
 * Handles dragging of the window by tracking mouse movements during drag operations.
 * Binds mouse/touch events to the drag region to track dragging state and move
 * the window accordingly.
 */
function dragWindow() {
    const titleBar = document.getElementById("drag-region");
    let isDragging = false;
    let offsetX, offsetY;

    titleBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - window.screenX;
        offsetY = e.clientY - window.screenY;
        console.log(`dragging started at ${window.screenX}, ${window.screenY}`);
    });

    window.addEventListener("mousemove", (e) => {
        if (isDragging === false) return;
        const { screenX, screenY } = e;
        // window.moveTo(screenX - offsetX, screenY - offsetY)
        window.moveBy(e.movementX, e.movementY);
        console.log(`moved to ${screenX - offsetX}, ${screenY - offsetY}`);
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });
}
/**
 * Sets up click handlers for window control buttons to minimize or close the window.
 *
 * The minimizeBtn and closeBtn elements are expected to exist in the DOM. When
 * clicked, they call the corresponding methods on window.electronAPI to minimize
 * or close the window.
 */
function setupWindowControls() {
    const minimizeBtn = document.getElementById("minimizeBtn");
    const closeBtn = document.getElementById("closeBtn");

    minimizeBtn.addEventListener("click", () => {
        window.electronAPI.minimizeWindow();
    });

    closeBtn.addEventListener("click", () => {
        window.electronAPI.closeWindow();
    });
}


