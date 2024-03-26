document.addEventListener("DOMContentLoaded", () => {
  updateTime(); // Start the clock when the page loads
  dragWindow()
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
  const titleBar = document.getElementById("body");
  let isDragging = false;
  let offsetX, offsetY;

  // Listen for the mouse down event on the title bar to initiate dragging
  titleBar.addEventListener("mousedown", (e) => {
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