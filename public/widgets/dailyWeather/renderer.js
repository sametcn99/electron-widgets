/* eslint-disable @typescript-eslint/no-var-requires */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date").innerText = new Date().toDateString();

  // reload page every 1 hour to get new weather data
  setTimeout(() => {
    location.reload();
  }, 3600000);
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

  const temp = document.getElementById("temp");
  temp.innerHTML = current.temperature_2m + "°C";
}
