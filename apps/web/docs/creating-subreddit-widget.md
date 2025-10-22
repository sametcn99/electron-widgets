# Creating Subreddit Widget

This guide explains step-by-step how to create a subreddit page. The example code provided below aims to fetch an RSS feed from a subreddit and display it on the page.

## HTML Structure

First, we create the basic HTML structure. This structure defines the skeleton of the page and specifies where the necessary elements will be located.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>r-programming</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>

  <body>
    <div id="message">
      <span> Getting information...</span>
      <div id="loading"></div>
    </div>
    <main>
      <h1 id="header">
        <img
          src="./reddit.png"
          title="reddit logo"
          width="24px"
          height="24px"
        />/programming
      </h1>
      <section id="container">
        <article id="item">
          <div id="title">title goes here</div>
          <div>
            <p id="pubDate">published date goes here</p>
            <div id="author" rel="noopener noreferrer">
             author username goes here
            </div>
          </div>
        </article>
      </section>
      <div id="scrollTopButton">Scroll Top</div>
    </main>
    <script src="./script.js"></script>
  </body>
</html>
```

## JavaScript Code

JavaScript code necessary for dynamically updating the page:

```javascript
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
        window.electronAPI.openExternal(element.link);
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
        window.electronAPI.openExternal(userLink);
      });
      // Append the new node to the main element
      main.appendChild(node);
    });
  }

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
    messageElement.textContent = "An error occurred: " + error.message;
  }
}
```

### Explanations

1. **HTML and CSS**: The HTML file defines the structure of the page. The CSS file (styles.css) sets the style of the page. The page includes sections for the main header, content container, and a loading message.

2. **JavaScript**: When the page loads, the `fetchDataAndUpdateUI` function runs. This function fetches the RSS feed from the subreddit and dynamically updates the page.
   - **Fetching RSS Feed**: The `window.electronAPI.getRSSFeed` function is used to fetch the RSS feed.(or you can use my reddit rss api :)
   - **Updating the UI**: The UI is updated with the fetched data, and each item is added to the page.
   - **Automatic Reload**: The widget automatically reloads every hour.
   - **Scroll Functionality**: When the page is scrolled, the 'Scroll Top' button becomes visible after a certain position, and clicking it scrolls the page back to the top.

This guide explains how to create a subreddit page and update it with dynamic data. The example code fetches the RSS feed from Reddit and displays the data on the page.
