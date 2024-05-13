document.addEventListener("DOMContentLoaded", () => {
  function render() {
    // Set the date
    document.getElementById("date").innerText = new Date().toDateString();
    let lon;
    let lat;
    // Fetch the user's location
    fetch("http://ip-api.com/json/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Location data:", data);
        lon = data.lon;
        lat = data.lat;
        console.log(lon, lat);

        let apiBaseURL = "https://api.open-meteo.com/v1/forecast?";
        // Construct the API URL with latitude and longitude
        let apiURL =
          apiBaseURL +
          `latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&daily=weather_code,temperature_2m_max&timeformat=unixtime&timezone=auto`;
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
        const temp = document.getElementById("temp");
        // Display the current temperature
        temp.innerHTML = current.temperature_2m + "°C";
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  }
  // Run the render function on load and every 5 minutes
  setInterval(render, 300000), render();
});
