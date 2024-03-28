/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

// Add event listener to execute code when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  dragWindow(); // Call dragWindow function to enable window dragging
  resizeWindow(); // Call resizeWindow function to handle window resizing

  // Add event listener to search input field for keydown event
  document
    .getElementById("searchInput")
    .addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        // Check if Enter key is pressed
        search(); // Call search function
      }
    });
});

// Function to perform search
function search() {
  try {
    var searchEngine = document.getElementById("searchEngine").value; // Get search engine value
    var searchTerm = document.getElementById("searchInput").value; // Get search term value

    if (searchTerm.trim() !== "") {
      // Check if search term is not empty
      var searchURL = searchEngine + encodeURIComponent(searchTerm); // Create search URL
      window.electronAPI.openExternalLink(searchURL); // Open search URL in external browser
    }
  } catch (error) {
    console.error("Error occurred during search:", error); // Log any errors that occur during search
  } finally {
    document.getElementById("searchInput").value = ""; // Clear search input field
  }
}

/**
 * Handles dragging of the window by tracking mouse events on the title bar element.
 * Listens for mousedown events to initiate dragging, tracks mousemove events to
 * update the window position during dragging, and listens for mouseup to stop dragging.
 */
function dragWindow() {
  const dragRegion = document.getElementsByTagName("body")[0];
  let isDragging = false;
  let offsetX, offsetY;

  // Listen for the mouse down event on the title bar to initiate dragging
  dragRegion.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - window.screenX;
    offsetY = e.clientY - window.screenY;
    console.log(`dragging started at ${window.screenX}, ${window.screenY}`);
  });

  // Track mouse movement to handle window dragging
  window.addEventListener("mousemove", (e) => {
    if (isDragging === false) return;
    const { screenX, screenY } = e;
    // window.moveTo(screenX - offsetX, screenY - offsetY)
    window.moveBy(e.movementX, e.movementY);
    console.log(`moved to ${screenX - offsetX}, ${screenY - offsetY}`);
  });

  // Stop dragging when mouse button is released
  window.addEventListener("mouseup", () => {
    isDragging = false;
    console.log(`dragging stopped`);
  });
}

/**
 * Handles resizing of the window by updating the stored width and height in the
 * widgets configuration file. Listens for the 'resize' event and gets the new
 * dimensions, then writes them back to the config.
 */
function resizeWindow() {
  // Add an event listener to handle window resize events
  window.addEventListener("resize", async () => {
    try {
      // Get the new window dimensions
      let width = window.innerWidth;
      let height = window.innerHeight;
      // Read the current widgets configuration
      const widgetsData = await window.electronAPI.readWidgetsJson();
      console.log(widgetsData);
      // Update the widget dimensions in the configuration
      widgetsData.search.width = width;
      widgetsData.search.height = height;
      // Write the updated configuration back to the file
      window.electronAPI.writeWidgetJson(widgetsData);
      console.log(`Window resized to: ${width}x${height}`);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });
}
