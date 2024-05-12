async function fetchDataAndUpdateUI() {
  // Örnek veri alımı yerine, sabit bir veri kullanıyorum.

  function updateUI() {
    document.getElementById("message").style.display = "none";
    document.getElementById("loading").style.display = "none";
    const main = document.getElementsByTagName("main")[0];
    main.style.display = "flex";
    main.querySelector("#platform").textContent = data.os.distro;
    main.querySelector("#kernel").textContent = "Kernel: " + data.os.kernel;
    main.querySelector("#architecture").textContent =
      "Architecture: " + data.os.arch;
    main.querySelector("#cpu-manufacturer").textContent =
      "Manufacturer: " + data.cpu.manufacturer;
    main.querySelector("#cpu-brand").textContent = data.cpu.brand;
    main.querySelector("#cpu-cores").textContent = "Cores: " + data.cpu.cores;
    main.querySelector("#cpu-speed").textContent = data.cpu.speed + "GHz";
    // Check if data.memory.array is defined and is an array before trying to call reduce
    if (data.memLayout && Array.isArray(data.memLayout)) {
      const totalMemory = data.memLayout.reduce(
        (acc, memory) => acc + memory.size,
        0
      );
      main.querySelector("#total-ram").textContent =
        bytesToGigabytes(totalMemory);
    }
    main.querySelector("#cpu-speed").textContent =
      "Speed: " + data.cpu.speed + "GHz";
    // Check if data.gpu is defined and is an array before trying to call forEach
    if (data.graphics.controllers && Array.isArray(data.graphics.controllers)) {
      const gpuContainer = main.querySelector("#gpu-container").cloneNode(true);
      main.querySelector("#gpu-container").innerHTML = "";
      data.graphics.controllers.forEach((gpuData) => {
        console.log(gpuData);
        const gpu = gpuContainer.querySelector("#gpu").cloneNode(true);
        gpu.textContent = gpuData.model;
        main.querySelector("#gpu-container").appendChild(gpu);
      });
    }
  }
  function bytesToGigabytes(bytes) {
    let gigabytes = bytes / (1024 * 1024 * 1024);
    return gigabytes.toFixed(2) + " GB";
  }
  const data = await window.electronAPI.getSystemInfo();
  console.log(data);
  if (data) updateUI();
}

// Call the async function
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
