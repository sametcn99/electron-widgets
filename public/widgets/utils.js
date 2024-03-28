/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Handles resizing of the window by updating the stored width and height in the
 * widgets configuration file. Listens for the 'resize' event and gets the new
 * dimensions, then writes them back to the config.
 */
export function resizeWindow(key) {
  // Add an event listener to handle window resize events
  window.addEventListener("resize", () => {
    try {
      // Require necessary modules
      const path = require("path");
      const jsonPath = path.join(
        require("os").homedir(),
        "Desktop",
        "widgets",
        "widgets.json",
      );
      const { readFileSync, writeFileSync } = require("fs");

      // Get the new window dimensions
      let width = window.innerWidth;
      let height = window.innerHeight;
      // Read the current widgets configuration
      const widgetsData = JSON.parse(readFileSync(jsonPath));
      console.log(widgetsData);
      // Update the widget dimensions in the configuration based on the key
      if (widgetsData[key]) {
        widgetsData[key].width = width;
        widgetsData[key].height = height;
      } else {
        console.error(`Widget with key '${key}' not found.`);
        return; // Stop execution if widget key is not found
      }
      // Write the updated configuration back to the file
      writeFileSync(jsonPath, JSON.stringify(widgetsData, null, 2));
      console.log(`Window resized to: ${width}x${height}`);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });
}
