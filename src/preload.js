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
 * Exposes Electron APIs and IPC methods to the main world
 */
contextBridge.exposeInMainWorld("electronAPI", {
  minimizeWindow: () => ipcRenderer.invoke('window-action', 'minimize'),
  closeWindow: () => ipcRenderer.invoke('window-action', 'close'),
  readWidgetsJSON: () => ipcRenderer.invoke("read-widgets-json"),
  writeWidgetsJSON: () => ipcRenderer.invoke("write-widgets-json"),
});

/**
 * Loads widget data from the main process and renders it to the DOM.
 * Fetches widget data from the main process via IPC, parses the JSON
 * response, and iterates over each widget object to create and append
 * DOM elements displaying the widget details.
 */
window.addEventListener("DOMContentLoaded", async () => {
  loadWidgets();

  /**
   * Loads widget data from Electron IPC and renders it to the DOM.
   * Fetches widget data from the main process via IPC, parses JSON,
   * and iterates over each widget to create and append DOM elements
   * for the widget title, dates, creator, and visibility toggle button.
   */
  async function loadWidgets() {
    try {
      let widgetsDataRaw = await ipcRenderer.invoke("read-widgets-json");
      const widgetsData = JSON.parse(widgetsDataRaw);
      if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
        console.error("Unexpected widgets data structure:", widgetsData);
        return;
      }
      const widgetsContainer = document.getElementById("widgetsData");
      widgetsContainer.innerHTML = ""; // Clear existing widgets

      // Iterate over the object properties
      Object.entries(widgetsData).forEach(([widgetKey, widgetDetails]) => {
        const widgetListItem = document.createElement("div");
        widgetListItem.classList.add("widget-list-item");
        widgetListItem.id = widgetKey; // Set the id to the widget key

        const widgetListItemDetails = document.createElement("div");
        widgetListItemDetails.classList.add("widget-list-item-details");

        // Create and append the title element
        const titleElement = document.createElement("h1");
        titleElement.textContent =
          widgetDetails.title || `Widget ${widgetKey} missing title`;
        widgetListItemDetails.appendChild(titleElement);
        titleElement.style.color = "#6666FF";
        // Create and append the created_at element
        const createdAtElement = document.createElement("p");
        createdAtElement.textContent =
          `Created: ${widgetDetails.created_at}` ||
          `Widget ${widgetKey} missing created_at`;
        widgetListItemDetails.appendChild(createdAtElement);

        // Create and append the updated_at element
        const updatedAtElement = document.createElement("p");
        updatedAtElement.textContent =
          `Updated: ${widgetDetails.updated_at}` ||
          `Widget ${widgetKey} missing updated_at`;
        widgetListItemDetails.appendChild(updatedAtElement);

        // Create and append the creator element
        const creatorElement = document.createElement("p");
        creatorElement.textContent =
          `Creator: ${widgetDetails.creator}` ||
          `Widget ${widgetKey} missing creator`;
        widgetListItemDetails.appendChild(creatorElement);

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
          if (makeVisible.classList.contains("eye-visible")) {
            makeVisible.classList.remove("eye-visible");
            makeVisible.classList.add("eye-invisible");
            await toggleWidgetVisibility(widgetKey, false);
          } else if (makeVisible.classList.contains("eye-invisible")) {
            // else make it visible
            makeVisible.classList.remove("eye-invisible");
            makeVisible.classList.add("eye-visible");
            await toggleWidgetVisibility(widgetKey, true);
          }
        });
        buttonsElement.appendChild(settingsButton);
        buttonsElement.appendChild(makeVisible);
        // Finally, append the widgetListItemDetails to the widgetsContainer
        widgetListItem.appendChild(widgetListItemDetails);
        widgetListItem.appendChild(buttonsElement);
        widgetsContainer.appendChild(widgetListItem);
      });
    } catch (error) {
      console.error("Failed to load widgets:", error);
    }
  }
});

/**
 * Toggles the visibility of a widget in the widgets data.
 *
 * @param {string} widgetId - The ID of the widget to toggle
 * @param {boolean} visible - Whether to set the widget visibility to true or false
 */
async function toggleWidgetVisibility(widgetId, visible) {
  try {
    let widgetsDataRaw = await ipcRenderer.invoke("read-widgets-json");
    let widgetsData = JSON.parse(widgetsDataRaw);
    if (Object.prototype.hasOwnProperty.call(widgetsData, widgetId)) {
      widgetsData[widgetId].visible = visible;
    } else {
      console.error("Widget not found: ", widgetId);
      return;
    }
    let data = JSON.stringify(widgetsData);
    await ipcRenderer.invoke("write-widgets-json", data);
  } catch (error) {
    console.error("Failed to toggle widget visibility:", error);
  }
}
