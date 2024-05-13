// Define an asynchronous function to fetch data and update the UI
async function fetchDataAndUpdateUI() {
  // Define a function to update the UI
  function updateUI() {
    // Hide the message and loading elements
    document.getElementById("message").style.display = "none";
    document.getElementById("loading").style.display = "none";
    // Get the main element
    const main = document.getElementsByTagName("main")[0];
    // Display the main element
    main.style.display = "flex";
    // Iterate over each item in the data
    data.items.forEach((element) => {
      // Clone the container element
      const node = document.getElementById("container").cloneNode(true);
      // Display the item and container elements
      node.querySelector("#item").style.display = "flex";
      node.style.display = "flex";
      // Set the title of the item
      node.querySelector("#title").textContent = element.title;
      // Add an event listener to open the link when the title is clicked
      node.querySelector("#title").addEventListener("click", () => {
        window.electronAPI.openExternalLink(element.link);
      });
      // Format the publication date
      const pubDate = new Date(element.pubDate);
      node.querySelector("#pubDate").textContent = pubDate.toLocaleString();
      // Create a link to the author's profile
      const userLink = "https://www.reddit.com/" + element.author;
      // Set the author of the item
      node.querySelector("#author").textContent = element.author;
      // Add an event listener to open the author's profile when the author is clicked
      node.querySelector("#author").addEventListener("click", () => {
        window.electronAPI.openExternalLink(userLink);
      });
      // Append the new node to the main element
      main.appendChild(node);
    });
  }

  const opml = await window.electronAPI.readCustomData(
    "r-programming",
    "feed.opml"
  );

  console.log(opml);

  const parseOpml = await window.electronAPI.opmlToJson(opml);
  console.log(parseOpml);
  // Fetch the RSS feed data
  const data = await window.electronAPI.getRSSFeed(
    "https://www.reddit.com/r/programming.rss"
  );
  // Log the data
  console.log(data);
  // If data exists, update the UI
  if (data) updateUI();
  // Set an interval to reload the widget every hour
  setInterval(
    () => window.electronAPI.reloadWidget("r-programming"),
    1000 * 60 * 60 // reload every hour
  );
}

// Add an event listener for the scroll event
window.onscroll = function () {
  scrollFunction();
};

// Define a function to handle the scroll event
function scrollFunction() {
  // Get the scrollTopButton element
  const scrollTopButton = document.getElementById("scrollTopButton");
  // If the scroll position is greater than 50, display the scrollTopButton
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollTopButton.style.display = "block";
  } else {
    // Otherwise, hide the scrollTopButton
    scrollTopButton.style.display = "none";
  }
}

// Add an event listener to the scrollTopButton to scroll to the top when clicked
document
  .getElementById("scrollTopButton")
  .addEventListener("click", function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

// Try to fetch data and update the UI
try {
  fetchDataAndUpdateUI();
} catch (error) {
  // If an error occurs, log it
  console.error(error);
  // Get the message element
  const messageElement = document.getElementById("message");
  // Hide the loading element
  document.getElementById("loading").style.display = "none";
  // If the message element exists, display the error message
  if (messageElement) {
    messageElement.textContent = "Hata oluştu: " + error.message;
  }
}
