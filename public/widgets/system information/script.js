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
    // Set the platform text
    main.querySelector("#platform").textContent = data.os.distro;
    // Set the kernel text
    main.querySelector("#kernel").textContent = "Kernel: " + data.os.kernel;
    // Set the architecture text
    main.querySelector("#architecture").textContent =
      "Architecture: " + data.os.arch;
    // Set the CPU manufacturer text
    main.querySelector("#cpu-manufacturer").textContent =
      "Manufacturer: " + data.cpu.manufacturer;
    // Set the CPU brand text
    main.querySelector("#cpu-brand").textContent = data.cpu.brand;
    // Set the CPU cores text
    main.querySelector("#cpu-cores").textContent = "Cores: " + data.cpu.cores;
    // Set the CPU speed text
    main.querySelector("#cpu-speed").textContent = data.cpu.speed + "GHz";
    // If memory layout data exists and is an array
    if (data.memLayout && Array.isArray(data.memLayout)) {
      // Calculate the total memory
      const totalMemory = data.memLayout.reduce(
        (acc, memory) => acc + memory.size,
        0,
      );
      // Set the total RAM text
      main.querySelector("#total-ram").textContent =
        bytesToGigabytes(totalMemory);
    }
    // Set the CPU speed text
    main.querySelector("#cpu-speed").textContent =
      "Speed: " + data.cpu.speed + "GHz";
    // If graphics controller data exists and is an array
    if (data.graphics.controllers && Array.isArray(data.graphics.controllers)) {
      // Clone the GPU container element
      const gpuContainer = main.querySelector("#gpu-container").cloneNode(true);
      // Clear the GPU container element
      main.querySelector("#gpu-container").innerHTML = "";
      // Iterate over each GPU data
      data.graphics.controllers.forEach((gpuData) => {
        // Clone the GPU element
        const gpu = gpuContainer.querySelector("#gpu").cloneNode(true);
        // Set the GPU text
        gpu.textContent = gpuData.model;
        // Append the GPU element to the GPU container
        main.querySelector("#gpu-container").appendChild(gpu);
      });
    }
  }
  // Define a function to convert bytes to gigabytes
  function bytesToGigabytes(bytes) {
    let gigabytes = bytes / (1024 * 1024 * 1024);
    return gigabytes.toFixed(2) + " GB";
  }
  // Read the custom data
  let data = await window.electronAPI.readCustomData(
    "system information",
    "data.json",
  );
  // If data exists, parse it
  if (data !== "") {
    data = JSON.parse(data);
  }
  // If data doesn't exist
  if (data === "") {
    // Get the system info
    data = await window.electronAPI.getSystemInfo();
    // Write the system info as custom data
    await window.electronAPI.writeCustomData(
      "system information",
      "data.json",
      data,
    );
  }
  // Log the data
  console.log(data);
  // If data exists, update the UI
  if (data) updateUI();
}

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
