document.addEventListener("DOMContentLoaded", () => {
  async function render() {
    try {
      // Set the current date
      document.getElementById("date").innerText = new Date().toDateString();
      
     
      const locationData = await window.electronAPI.getLocation();
      console.log("Location data:", locationData);

      const { lon, lat, country, regionName } = locationData;

      // Update location information in the DOM
      document.getElementById("country").innerText = country;
      document.getElementById("regionName").innerText = regionName;

      // Construct the API URL with latitude and longitude
      const apiBaseURL = "https://api.open-meteo.com/v1/forecast";
      const apiURL = `${apiBaseURL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&daily=weather_code,temperature_2m_max&timeformat=unixtime&timezone=auto`;

      // Fetch weather data
      const weatherResponse = await fetch(apiURL);
      const weatherData = await weatherResponse.json();
      const currentTime = new Date().toLocaleString();
      console.log(`${currentTime} Weather data:`, weatherData);

      // Update weather information in the DOM
      const current = weatherData.current;
      document.getElementById("temp").innerText = `${current.temperature_2m}°C`;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  // Initial render and subsequent updates every 5 minutes
  render();
  setInterval(render, 300000);
});
