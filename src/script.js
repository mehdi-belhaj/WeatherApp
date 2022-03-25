let weather = {
  apiKey: "48cf0ed1169dfdaedcb9d8c17a35bca1",

  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((res) => res.json())
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    /* Extract informations from the data */
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, temp, icon, description, humidity, speed);

    /* Display informations on the page (HTML) */
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".temp").innerText = temp + " °C";
    document.querySelector(".weather-icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText =
      "humidity: " + humidity + "%";
    document.querySelector(".wind-speed").innerText =
      "Wind speed: " + speed + " km/h";
  },
};
