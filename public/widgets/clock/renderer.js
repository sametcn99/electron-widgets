document.addEventListener("DOMContentLoaded", () => {
  updateTime(); // Call the updateTime function when the DOM content is loaded
});

function updateTime() {
  let now = new Date(); // Create a new Date object to get the current date and time
  let hour = now.getHours(); // Get the current hour
  let minute = now.getMinutes(); // Get the current minute
  let second = now.getSeconds(); // Get the current second

  let dateElement = document.getElementById("date"); // Get the element with the id "date"
  dateElement.textContent = now.toDateString(); // Set the text content of the date element to the current date

  hour = hour < 10 ? "0" + hour : hour; // Add leading zero if hour is less than 10
  minute = minute < 10 ? "0" + minute : minute; // Add leading zero if minute is less than 10
  second = second < 10 ? "0" + second : second; // Add leading zero if second is less than 10

  let timeHTML = hour + ":" + minute + ":" + second; // Create a string with the formatted time
  document.getElementById("clock").textContent = timeHTML; // Set the text content of the clock element to the formatted time
}

setInterval(updateTime, 1000); // Call the updateTime function every second to update the clock
