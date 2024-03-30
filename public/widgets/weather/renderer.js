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
  var weatherDiv = document.getElementById("weather");
  var current = data.current;
  var daily = data.daily;

  var weatherHTML = "";

  // Render current weather
  var currentWeatherIcon =
    current.weather_code === 0
      ? '<i class="fas fa-sun weather-icon"></i>'
      : '<i class="fas fa-cloud-sun weather-icon"></i>';
  weatherHTML += `
            <div id="current-weather" class="card">
                <div>${currentWeatherIcon}</div>
                <div class="weather-info">${current.temperature_2m}°C</div>
                <div class="weather-info">${current.is_day ? "Day" : "Night"}</div>
            </div>
        `;

  daily.time.slice(0, 4).forEach((time, index) => {
    var weatherIcon =
      daily.weather_code[index] === 0
        ? '<i class="fas fa-sun weather-icon"></i>'
        : '<i class="fas fa-cloud-sun weather-icon"></i>';
    weatherHTML += `
                <div id="daily-weather-${new Date(time * 1000).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()}" class="card">
                    <div>${weatherIcon}</div>
                    <div class="weather-info">${daily.temperature_2m_max[index]}°C</div>
                    <div class="weather-info">${new Date(time * 1000).toLocaleDateString("en-US", { weekday: "long" })}</div>
                </div>
            `;
  });

  weatherDiv.innerHTML = weatherHTML;
}
