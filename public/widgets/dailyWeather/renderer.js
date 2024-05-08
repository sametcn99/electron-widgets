/* eslint-disable @typescript-eslint/no-var-requires */
document.addEventListener("DOMContentLoaded", () => {
  function render() {
    document.getElementById("date").innerText = new Date().toDateString();
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
        var current = data.current;
        // var weatherHTML = "";

        const temp = document.getElementById("temp");
        temp.innerHTML = current.temperature_2m + "°C";
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  }
  // run render function on load and every 5 minutes
  setInterval(render, 300000), render();
});
