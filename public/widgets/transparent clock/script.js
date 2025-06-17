// Add an event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
  // Call the updateTime function when the page loads
  updateTime();

  // Define a function to update the time
  function updateTime() {
    // Get the current date and time
    let now = new Date();
    // Get the current hour
    let hour = now.getHours();
    // Get the current minute
    let minute = now.getMinutes();
    // Get the current second
    let second = now.getSeconds();
    // If the second is less than 10, prepend it with a 0
    if (second < 10) {
      second = "0" + second;
    }
    // If the hour is less than 10, prepend it with a 0
    hour = hour < 10 ? "0" + hour : hour;
    // If the minute is less than 10, prepend it with a 0
    minute = minute < 10 ? "0" + minute : minute;

    // Construct the time string
    let timeHTML = hour + ":" + minute + ":" + second;
    // Set the text content of the clock element to the time string
    document.getElementById("clock").textContent = timeHTML;
  }

  // Call the updateTime function every second
  setInterval(updateTime, 1000);
});
