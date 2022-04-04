let user = {
  default_city: "London",

  api_key: "e1cfb0d8192f42ac8dc7eeb206aa36ee",
  api_url: "https://api.opencagedata.com/geocode/v1/json",

  reverseGeocode: function (lat, lng) {
    let request = new XMLHttpRequest();

    request.open("GET", this.generate_api_url(lat, lng), true);
    request.onload = function () {
      if (request.status === 200) {
        // Success!
        let data = JSON.parse(request.responseText);
        let city = data.results[0].components.city;
        weather.fetchWeather(city); // Display user's current city weather
        console.log("User Location:", data.results[0]);
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },

  getLocation: function () {
    if (navigator.geolocation) {
      // navigator support geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          this.reverseGeocode(lat, lng);
        },
        (error) => {
          console.error("navigator.geolocation == false", error);
          // display default city weather infos
          weather.fetchWeather(user.default_city);
        }
      );
    } else {
      // navigator doesn't support geolocation
      console.log("Geolocation is not supported by this browser.");
      // display default city weather infos
      weather.fetchWeather(user.default_city);
    }
  },

  generate_api_url: function (latitude, longitude) {
    return (
      this.api_url +
      `?key=${this.api_key}` +
      `&q=${encodeURIComponent(latitude + "," + longitude)}` +
      `&pretty=1&no_annotations=1`
    );
  },
};

let weather = {
  api_key: "48cf0ed1169dfdaedcb9d8c17a35bca1",
  api_url: "https://api.openweathermap.org/data/2.5/weather?q=",

  generate_api_url: function (city) {
    return this.api_url + city + "&units=metric&appid=" + this.api_key;
  },

  fetchWeather: function (city) {
    let request_url = this.generate_api_url(city);
    fetch(request_url)
      .then((res) => res.json())
      .then((data) => this.displayWeather(data), (error) => console.log('error'));
  },

  displayWeather: function (data) {
    /* Extract informations from the data */
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log("Weather Information:", data);

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
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
    document.querySelector(".weather").classList.toggle("loading");
  },

  search: function () {
    document.querySelector(".weather").classList.toggle("loading");
    const city = document.querySelector("#search-input").value;
    this.fetchWeather(city);
  },
};

/** Search bar content  */
let searchBar = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-btn");

/* Clear search input */
// searchBar.value = '';

/* Enter keyup event */
searchBar.addEventListener("keyup", function (event) {
  if (event.key == "Enter")
    if (searchBar.value != "") weather.search();
    else alert("Please enter a city name!");
});

/* Button click event */
searchBtn.addEventListener("click", function () {
  if (searchBar.value != "") weather.search();
  else alert("Please enter a city name!");
});

/* Loaded the user's current city weather */
user.getLocation();
