async function fetchDataAndUpdateUI() {
  // Örnek veri alımı yerine, sabit bir veri kullanıyorum.

  function updateUI() {
    document.getElementById("message").style.display = "none";
    document.getElementById("loading").style.display = "none";
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "flex";
  }

  const data = await window.electronAPI.getSystemInfo();
  console.log(data);
  if (data) updateUI();
  setInterval(
    () => window.electronAPI.reloadWidget("disk usage"),
    1000 * 60 * 60
  );
}

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
