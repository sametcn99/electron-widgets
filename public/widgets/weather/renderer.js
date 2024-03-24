function updateWeather() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=Ankara&appid=YOUR_API_KEY&units=metric'; // Change the API URL according to your city and API key
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            var weatherDescription = data.weather[0].description;
            var temperature = data.main.temp;
            var humidity = data.main.humidity;

            var weatherHTML = "Weather: " + weatherDescription + "<br>";
            weatherHTML += "Temperature: " + temperature + " °C<br>";
            weatherHTML += "Humidity: " + humidity + " %";

            document.getElementById('weather').innerHTML = weatherHTML;
        })
        .catch(error => {
            console.log('An error occurred while fetching weather data:', error);
            document.getElementById('weather').textContent = 'Weather data could not be retrieved.';
        });
}

updateWeather(); // Get weather data when the page loads
