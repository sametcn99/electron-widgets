/* eslint-disable @typescript-eslint/no-var-requires */
document.addEventListener("DOMContentLoaded", () => {
  resizeWindow();
});

let lon;
let lat;

fetch("http://ip-api.com/json/")
  .then((response) => response.json())
  .then((data) => {
    console.log("Location data:", data);
    lon = data.lon;
    lat = data.lat;
    console.log(lon, lat);

    // Hava durumu verilerini çekme işlemi
    let apiBaseURL = "https://api.open-meteo.com/v1/forecast?";
    let apiURL =
      apiBaseURL +
      `latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&daily=weather_code,temperature_2m_max&timeformat=unixtime&timezone=auto`;

    return fetch(apiURL);
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Weather data:", data);
    renderWeatherData(data);
  })
  .catch((error) => {
    console.log("An error occurred:", error);
  });

function renderWeatherData(data) {
  var current = data.current;
  // var weatherHTML = "";

  // // Render current weather
  var currentWeatherIcon =
    current.weather_code === 0
      ? "fas fa-sun weather-icon"
      : "fas fa-cloud-sun weather-icon";
  const icon = document.getElementById("icon");
  icon.classList = currentWeatherIcon;
  const temp = document.getElementById("temp");
  temp.innerHTML = current.temperature_2m + "°C";
}

/**
 * Handles resizing of the window by updating the stored width and height in the
 * widgets configuration file. Listens for the 'resize' event and gets the new
 * dimensions, then writes them back to the config.
 */
function resizeWindow() {
  // Add an event listener to handle window resize events
  window.addEventListener("resize", async () => {
    try {
      // Get the new window dimensions
      let width = window.innerWidth;
      let height = window.innerHeight;
      // Read the current widgets configuration
      const widgetsData = await window.electronAPI.readWidgetsJson();
      // Update the widget dimensions in the configuration
      widgetsData.dailyWeather.width = width;
      widgetsData.dailyWeather.height = height;
      // Write the updated configuration back to the file
      window.electronAPI.writeWidgetJson(widgetsData);
      console.log(`Window resized to: ${width}x${height}`);
    } catch (error) {
      // Log any errors that occur during the resize process
      console.error("Error resizing window:", error);
    }
  });
}
