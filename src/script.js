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
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
    document.querySelector(".weather").classList.remove("loading")
  },
  search: function () {
    document.querySelector(".weather").classList.add("loading")
    const city = document.querySelector("#search-input").value;
    this.fetchWeather(city);
  },
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var apikey = "369a9148caf7443e8741b1c14782ce14";

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status == 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city);
        console.log(data.results[0].components.city)
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
  getLocation: function() {
    function success (data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
      weather.fetchWeather("Denver");
    }
  }
};

/* Clear search input */
// document.querySelector("#search-input").value = '';

/* input keyUup `Enter` event */
document
  .querySelector("#search-input")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

/* button click event */
document.querySelector("#search-btn").addEventListener("click", function () {
  weather.search();
});

/* Default city loaded in the frist time. (will be replaced by user location) */
geocode.getLocation();

