import { ipcRenderer } from "electron";

/**
 * Loads widget data from Electron IPC and renders it to the DOM.
 * Fetches widget data from the main process via IPC, parses JSON,
 * and iterates over each widget to create and append DOM elements
 * for the widget title, dates, creator, and visibility toggle button.
 */
export async function loadWidgets() {
  try {
    // Parse the raw data into a JSON object
    const widgetsData: WidgetsConfig = await ipcRenderer.invoke(
      "read-widgets-json"
    );
    // Check if the data structure is not an object or if it's an array
    if (typeof widgetsData !== "object" || Array.isArray(widgetsData)) {
      console.error("Unexpected widgets data structure:", widgetsData);
      return;
    }

    const widgetsContainer = document.getElementById("widgetsData");

    /**
     * Renders widget data to the DOM.
     * Fetches widget data from the main process via IPC, parses the JSON response
     * and iterates over each widget object to create and append DOM elements
     * displaying the widget details such as title, dates, creator and a visibility toggle button.
     */
    if (widgetsContainer) {
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

        /**
         * Adds the appropriate visibility class to the makeVisible button based on
         * the widgetDetails.visible property. If visible is true, adds the "eye-visible"
         * class. If visible is false, adds the "eye-invisible" class.
         */
        if (widgetDetails.visible) {
          makeVisible.classList.add("eye-visible");
        } else if (widgetDetails.visible === false) {
          makeVisible.classList.add("eye-invisible");
        }

        /**
         * Handles clicks on the "makeVisible" button to toggle the visibility
         * of the widget. Toggles the "eye-visible" and "eye-invisible" classes
         * on the button based on the current visibility state. Also calls the
         * toggleWidgetVisibility function to update the backend visibility state.
         */
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
    }
  } catch (error) {
    console.error("Failed to load widgets:", error);
  }
}

/**
 * Sets up click event handlers for the window control buttons to minimize and close the window.
 */
export function setupWindowControls() {
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");

  if (minimizeBtn && closeBtn) {
    minimizeBtn.addEventListener("click", () => {
      ipcRenderer.invoke("window-action", "minimize");
    });
    closeBtn.addEventListener("click", () => {
      ipcRenderer.invoke("window-action", "close");
    });
  }
}

/**
 * Toggles the visibility of a widget in the widgets data.
 * @param {string} widgetId - The ID of the widget to toggle
 * @param {boolean} visible - Whether to set the widget visibility to true or false
 */
async function toggleWidgetVisibility(widgetId: string, visible: boolean) {
  try {
    // Invoke IPC to read the current widgets configuration
    const widgetsData: WidgetsConfig = await ipcRenderer.invoke(
      "read-widgets-json"
    );
    // Check if the widget exists in the configuration
    if (widgetsData[widgetId as keyof WidgetsConfig]) {
      // Update the visibility of the widget
      widgetsData[widgetId as keyof WidgetsConfig].visible = visible;
    } else {
      // Log an error if the widget is not found
      console.error("Widget not found: ", widgetId);
      return;
    }
    const data = widgetsData;
    // Write the updated widgets configuration back
    ipcRenderer.invoke("write-widgets-json", data);
    // Create or close the widget window based on visibility
    if (visible === true) {
      ipcRenderer.invoke("create-widget-window", widgetId);
    } else if (visible === false) {
      ipcRenderer.invoke("close-widget-window", widgetId);
    }
  } catch (error) {
    // Log any errors encountered during the process
    console.error("Failed to toggle widget visibility:", error);
  }
}
