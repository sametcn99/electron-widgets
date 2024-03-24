// renderer.js
/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadWidgets();
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


/**
 * Loads widget data from Electron and renders them in the UI.
 * Parses the raw data from Electron, iterates over each widget object,
 * and generates DOM elements to display the widget details.
 */
async function loadWidgets() {
    try {
        const widgetsDataRaw = await window.electronAPI.readWidgetsJSON();
        const widgetsData = JSON.parse(widgetsDataRaw);
        if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
            console.error("Unexpected widgets data structure:", widgetsData);
            return;
        }
        const widgetsContainer = document.getElementById("widgetsData");
        widgetsContainer.innerHTML = ""; // Clear existing widgets

        // Iterate over the object properties
        Object.entries(widgetsData).forEach(([widgetKey, widgetDetails]) => {
            const widgetElement = document.createElement("div");
            widgetElement.classList.add("widget-list-item-details");

            const widgetListItemDetails = document.createElement("div");
            widgetListItemDetails.classList.add("widget-list-item");

            // Create and append the title element
            const titleElement = document.createElement("h1");
            titleElement.textContent =
                widgetDetails.title || `Widget ${widgetKey} missing title`;
            widgetElement.appendChild(titleElement);
            titleElement.style.color = "#6666FF";
            // Create and append the created_at element
            const createdAtElement = document.createElement("p");
            createdAtElement.textContent =
                `Created: ${widgetDetails.created_at}` ||
                `Widget ${widgetKey} missing created_at`;
            widgetElement.appendChild(createdAtElement);

            // Create and append the updated_at element
            const updatedAtElement = document.createElement("p");
            updatedAtElement.textContent =
                `Updated: ${widgetDetails.updated_at}` ||
                `Widget ${widgetKey} missing updated_at`;
            widgetElement.appendChild(updatedAtElement);

            // Create and append the creator element
            const creatorElement = document.createElement("p");
            creatorElement.textContent =
                `Creator: ${widgetDetails.creator}` ||
                `Widget ${widgetKey} missing creator`;
            widgetElement.appendChild(creatorElement);

            // Create and append the settings button
            const settingsButton = document.createElement("button");
            settingsButton.classList.add("settings-icon");
            settingsButton.classList.add("icon");
            // Create and append the buttons element
            const buttonsElement = document.createElement("div");
            const makeVisible = document.createElement("button");
            makeVisible.classList.add("icon");

            if (widgetDetails.visible) {
                makeVisible.classList.add("eye-visible");
            } else {
                makeVisible.classList.add("eye-invisible");
            }

            makeVisible.addEventListener("click", function () {
                // if eye is visible make it invisible
                if (makeVisible.classList.contains("eye-visible")) {
                    makeVisible.classList.remove("eye-visible");
                    makeVisible.classList.add("eye-invisible");
                } else {
                    // else make it visible
                    makeVisible.classList.remove("eye-invisible");
                    makeVisible.classList.add("eye-visible");
                }
            });

            buttonsElement.appendChild(settingsButton);
            buttonsElement.appendChild(makeVisible);
            // Finally, append the widgetElement to the widgetsContainer
            widgetListItemDetails.appendChild(widgetElement);
            widgetListItemDetails.appendChild(buttonsElement);
            widgetsContainer.appendChild(widgetListItemDetails);
        });
    } catch (error) {
        console.error("Failed to load widgets:", error);
    }
}
