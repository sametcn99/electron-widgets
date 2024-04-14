/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

document.addEventListener("DOMContentLoaded", () => {
  updateTime(); // Start the clock when the page loads
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