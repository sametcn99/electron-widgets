/* eslint-disable no-undef */
/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


const { contextBridge, ipcRenderer } = require('electron/renderer')

/**
 * Exposes Electron APIs to the renderer process via contextBridge.
 * This makes the minimizeWindow and closeWindow functions available
 * in the global namespace of the renderer process.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.invoke("minimize-window"),
  closeWindow: () => ipcRenderer.invoke("close-window"),
  readWidgetsJSON: () => ipcRenderer.invoke("read-widgets-json"),
  writeWidgetsJSON: () => ipcRenderer.invoke("write-widgets-json"),
});

window.addEventListener('DOMContentLoaded', async () => {
  loadWidgets()
  /**
 * Loads widget data from Electron and renders them in the UI.
 * Parses the raw data from Electron, iterates over each widget object,
 * and generates DOM elements to display the widget details.
 */
  async function loadWidgets() {
    try {
      let widgetsDataRaw = await ipcRenderer.invoke("read-widgets-json")
      const widgetsData = JSON.parse(widgetsDataRaw);
      if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
        console.error("Unexpected widgets data structure:", widgetsData);
        return;
      }
      const widgetsContainer = document.getElementById("widgetsData");
      widgetsContainer.innerHTML = ""; // Clear existing widgets

      // Iterate over the object properties
      Object.entries(widgetsData).forEach(([widgetKey, widgetDetails]) => {
        const widgetListItemDetails = document.createElement("div");
        widgetListItemDetails.classList.add("widget-list-item");
        widgetListItemDetails.id = widgetKey; // Set the id to the widget key

        const widgetElement = document.createElement("div");
        widgetElement.classList.add("widget-list-item-details");


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
        } else if (widgetDetails.visible === false) {
          makeVisible.classList.add("eye-invisible");
        }

        makeVisible.addEventListener("click", async function () {
          // if eye is visible make it invisible
          if (makeVisible.classList.contains("eye-visible") && widgetDetails.visible === true && widgetListItemDetails.id === widgetKey) {
            makeVisible.classList.remove("eye-visible");
            makeVisible.classList.add("eye-invisible");
            await toggleWidgetVisibility(widgetKey, false);
          } else if (makeVisible.classList.contains("eye-invisible") && widgetDetails.visible === false && widgetListItemDetails.id === widgetKey) {
            // else make it visible
            makeVisible.classList.remove("eye-invisible");
            makeVisible.classList.add("eye-visible");
            await toggleWidgetVisibility(widgetKey, true);
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
})






async function toggleWidgetVisibility(widgetId, visible) {
  try {
    let widgetsDataRaw = await ipcRenderer.invoke("read-widgets-json")
    let widgetsData = JSON.parse(widgetsDataRaw);
    if (Object.prototype.hasOwnProperty.call(widgetsData, widgetId)) {
      widgetsData[widgetId].visible = visible
    } else {
      console.error("Widget not found: ", widgetId);
      return;
    }
    let data = JSON.stringify(widgetsData);
    await ipcRenderer.invoke("write-widgets-json", data)
  } catch (error) {
    console.error("Failed to toggle widget visibility:", error);
  }
}
