/**
 * Fetches data from an RSS feed, updates the UI, and checks for app updates.
 * @returns {Promise<void>} A promise that resolves when the data is fetched and the UI is updated.
 */
async function fetchDataAndUpdateUI() {
  // Update the UI to show loading state
  document.getElementById("message").style.display = "none";
  document.getElementById("loading").style.display = "none";

  // Fetch data from the RSS feed
  const data = await window.electronAPI.getRSSFeed(
    "https://github.com/sametcn99/electron-widgets/releases.atom",
  );
  console.log(data);

  // Update the UI with the fetched data
  function updateUI() {
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "flex";
    data.items.forEach((element) => {
      const node = document.getElementById("container").cloneNode(true);
      node.querySelector("#item").style.display = "flex";
      node.style.display = "flex";
      node.querySelector("#title").textContent = element.title;
      node.querySelector("#title").addEventListener("click", () => {
        window.electronAPI.openExternal(element.link);
      });
      const pubDate = new Date(element.pubDate);
      node.querySelector("#pubDate").textContent = pubDate.toLocaleString();
      const userLink = "https://www.github.com/" + element.author;
      node.querySelector("#author").textContent = element.author;
      node.querySelector("#author").addEventListener("click", () => {
        window.electronAPI.openExternal(userLink);
      });
      main.appendChild(node);
    });
  }

  // Check for app updates
  const version = await window.electronAPI.getAppVersion();

  // Update the UI with the app version
  document.getElementById("version").textContent =
    `You are using version ${version} of the app.`;

  // Update the UI if data is available
  if (data) updateUI();

  // Reload the widget every hour
  setInterval(
    () => window.electronAPI.reloadWidget("disk usage"),
    1000 * 60 * 60,
  );
}

// Function to handle scroll event
function scrollFunction() {
  const scrollTopButton = document.getElementById("scrollTopButton");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollTopButton.style.display = "block";
  } else {
    scrollTopButton.style.display = "none";
  }
}

// Attach scroll event listener
window.onscroll = function () {
  scrollFunction();
};

// Scroll to top button click event
document
  .getElementById("scrollTopButton")
  .addEventListener("click", function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

try {
  fetchDataAndUpdateUI();
} catch (error) {
  console.error(error);
  const messageElement = document.getElementById("message");
  document.getElementById("loading").style.display = "none";
  if (messageElement) {
    messageElement.textContent = "Hata oluştu: " + error.message;
  }
}
