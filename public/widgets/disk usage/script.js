async function fetchDataAndUpdateUI() {
  // Örnek veri alımı yerine, sabit bir veri kullanıyorum.
  const data = await window.electronAPI.getDiskUsage();
  console.log(data);
  function updateDiskUsage(data) {
    const main = document.getElementsByTagName("main")[0];
    data.forEach((element) => {
      const node = document.getElementById("container").cloneNode(true);
      node.style.display = "flex";
      node.querySelector("#mounted").textContent = element.fs;
      const used = bytesToGigabytes(element.used);
      const total = bytesToGigabytes(element.size);
      const usingPercentage = ((element.used / element.size) * 100).toFixed(2);
      node.querySelector("#usedSpace").textContent = used;
      node.querySelector("#totalSpace").textContent = total;
      node.querySelector("#bar").textContent =
        "Using: " + usingPercentage + "%";
      node.querySelector("#bar").style.width = usingPercentage + "%";
      main.appendChild(node);
    });
  }

  function bytesToGigabytes(bytes) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  // Call the updateDiskUsage function with the fetched data
  updateDiskUsage(data);
  setInterval(
    () => window.electronAPI.reloadWidget("disk usage"),
    1000 * 60 * 60
  );
}

// Call the async function
fetchDataAndUpdateUI();
