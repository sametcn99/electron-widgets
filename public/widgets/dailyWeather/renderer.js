/* eslint-disable @typescript-eslint/no-var-requires */
document.addEventListener("DOMContentLoaded", () => {});

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
    // set location to display
    const country = document.getElementById("country");
    country.innerText = data.country;
    const regionName = document.getElementById("regionName");
    regionName.innerText = data.regionName;
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
