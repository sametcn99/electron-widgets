async function fetchDataAndUpdateUI() {
  // Örnek veri alımı yerine, sabit bir veri kullanıyorum.

  function updateUI() {
    document.getElementById("message").style.display = "none";
    document.getElementById("loading").style.display = "none";
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "flex";
    data.items.forEach((element) => {
      const node = document.getElementById("container").cloneNode(true);
      node.querySelector("#item").style.display = "flex";
      node.style.display = "flex";
      node.querySelector("#title").textContent = element.title;
      node.querySelector("#title").addEventListener("click", () => {
        window.electronAPI.openExternalLink(element.link);
      });
      const pubDate = new Date(element.pubDate);
      node.querySelector("#pubDate").textContent = pubDate.toLocaleString();
      const userLink = "https://www.github.com/" + element.author;
      node.querySelector("#author").textContent = element.author;
      node.querySelector("#author").addEventListener("click", () => {
        window.electronAPI.openExternalLink(userLink);
      });
      main.appendChild(node);
    });
  }

  const data = await window.electronAPI.getRSSFeed(
    "https://github.com/sametcn99/electron-widgets/releases.atom",
  );
  console.log(data);

  const latestVersion = data.items[0].title.trim();
  const version = await window.electronAPI.getAppVersion();
  if (latestVersion !== version) {
    window.alert(
      `There is a new version available: ${latestVersion}\n You are using version ${version} of the app.\nPlease download the latest version from the releases page.`,
    );
  } else {
    console.log(`You are using the latest version of the app.`);
  }

  document.getElementById("version").textContent =
    `You are using version ${version} of the app.`;

  if (data) updateUI();
  setInterval(
    () => window.electronAPI.reloadWidget("disk usage"),
    1000 * 60 * 60, // reload every hour
  );
}

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  const scrollTopButton = document.getElementById("scrollTopButton");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    scrollTopButton.style.display = "block";
  } else {
    scrollTopButton.style.display = "none";
  }
}

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
