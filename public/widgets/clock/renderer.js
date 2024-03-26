/* eslint-disable no-undef */


document.addEventListener("DOMContentLoaded", () => {
  updateTime(); // Start the clock when the page loads
  dragWindow()
  resizeWindow()
});

function updateTime() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  let dateElement = document.getElementById("date");
  dateElement.textContent = now.toDateString();

  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;

  let timeHTML = hour + ":" + minute + ":" + second;
  document.getElementById("clock").textContent = timeHTML;
}

setInterval(updateTime, 1000); // Update every second


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
      // Update the clock widget dimensions in the configuration
      widgetsData.clock.width = width;
      widgetsData.clock.height = height;
      // Write the updated configuration back to the file
      writeFileSync(jsonPath, JSON.stringify(widgetsData, null, 2));
      console.log(`Window resized to: ${width}x${height}`);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });
}
