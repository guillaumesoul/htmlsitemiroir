configCurrentWeather =  {
    location: false,
        locationID: "2996944",
        appid: "6511de2cf731ca33fb823b369b56f72f",
        units: "metric",
        updateInterval: 10 * 60 * 1000, // every 10 minutes
        animationSpeed: 1000,
        timeFormat: 24,
        showPeriod: true,
        showPeriodUpper: false,
        showWindDirection: true,
        showWindDirectionAsArrow: false,
        useBeaufort: true,
        useKMPHwind: false,
        lang: 'fr',
        decimalSymbol: ".",
        showHumidity: false,
        degreeLabel: false,
        showIndoorTemperature: false,
        showIndoorHumidity: false,
        showFeelsLike: true,

        initialLoadDelay: 0, // 0 seconds delay
        retryDelay: 2500,

        apiVersion: "2.5",
        apiBase: "https://api.openweathermap.org/data/",
        weatherEndpoint: "weather",

        appendLocationNameToHeader: true,
        calendarClass: "calendar",

        onlyTemp: false,
        roundTemp: false,

        iconTable: {
        "01d": "wi-day-sunny",
            "02d": "wi-day-cloudy",
            "03d": "wi-cloudy",
            "04d": "wi-cloudy-windy",
            "09d": "wi-showers",
            "10d": "wi-rain",
            "11d": "wi-thunderstorm",
            "13d": "wi-snow",
            "50d": "wi-fog",
            "01n": "wi-night-clear",
            "02n": "wi-night-cloudy",
            "03n": "wi-night-cloudy",
            "04n": "wi-night-cloudy",
            "09n": "wi-night-showers",
            "10n": "wi-night-rain",
            "11n": "wi-night-thunderstorm",
            "13n": "wi-night-snow",
            "50n": "wi-night-alt-cloudy-windy"
    },
};

start();
updateWeather();


setInterval(function() {
    //updateWeather();
}, 600000);

/*setInterval(function() {
    console.log('coucou2 ?');
}, 1000);*/


function start() {
    // Set locale.
    moment.locale('fr');

    this.windSpeed = null;
    this.windDirection = null;
    this.windDeg = null;
    this.sunriseSunsetTime = null;
    this.sunriseSunsetIcon = null;
    this.temperature = null;
    this.indoorTemperature = null;
    this.indoorHumidity = null;
    this.weatherType = null;
    this.feelsLike = null;
    this.loaded = false;
    //scheduleUpdate(configCurrentWeather.initialLoadDelay);

};

 function getDom() {
     console.log('getDom');
     console.log(this);
    var wrapper = document.createElement("div");

    if (configCurrentWeather.appid === "") {
        wrapper.innerHTML = "Please set the correct openweather <i>appid</i> in the config for module: " + this.name + ".";
        wrapper.className = "dimmed light small";
        return wrapper;
    }

    if (!this.loaded) {
        wrapper.innerHTML = ("CHARGEMENT");
        wrapper.className = "dimmed light small";
        return wrapper;
    }

    if (configCurrentWeather.onlyTemp === false) {
        this.addExtraInfoWeather(wrapper);
    }

    var large = document.createElement("div");
    large.className = "large light";

    var weatherIcon = document.createElement("span");
    weatherIcon.className = "wi weathericon " + this.weatherType;
    large.appendChild(weatherIcon);

    var degreeLabel = "";
    if (configCurrentWeather.degreeLabel) {
        switch (configCurrentWeather.units ) {
            case "metric":
                degreeLabel = "C";
                break;
            case "imperial":
                degreeLabel = "F";
                break;
            case "default":
                degreeLabel = "K";
                break;
        }
    }

    if (configCurrentWeather.decimalSymbol === "") {
        configCurrentWeather.decimalSymbol = ".";
    }

    var temperature = document.createElement("span");
    temperature.className = "bright";
    temperature.innerHTML = " " + this.temperature.replace(".", configCurrentWeather.decimalSymbol) + "&deg;" + degreeLabel;
    large.appendChild(temperature);

    if (configCurrentWeather.showIndoorTemperature && this.indoorTemperature) {
        var indoorIcon = document.createElement("span");
        indoorIcon.className = "fa fa-home";
        large.appendChild(indoorIcon);

        var indoorTemperatureElem = document.createElement("span");
        indoorTemperatureElem.className = "bright";
        indoorTemperatureElem.innerHTML = " " + this.indoorTemperature.replace(".", configCurrentWeather.decimalSymbol) + "&deg;" + degreeLabel;
        large.appendChild(indoorTemperatureElem);
    }

    if (configCurrentWeather.showIndoorHumidity && this.indoorHumidity) {
        var indoorHumidityIcon = document.createElement("span");
        indoorHumidityIcon.className = "fa fa-tint";
        large.appendChild(indoorHumidityIcon);

        var indoorHumidityElem = document.createElement("span");
        indoorHumidityElem.className = "bright";
        indoorHumidityElem.innerHTML = " " + this.indoorHumidity + "%";
        large.appendChild(indoorHumidityElem);
    }

    wrapper.appendChild(large);

    if (configCurrentWeather.showFeelsLike && configCurrentWeather.onlyTemp === false){
        var small = document.createElement("div");
        small.className = "normal medium";

        var feelsLike = document.createElement("span");
        feelsLike.className = "dimmed";
        feelsLike.innerHTML = "Feels " + this.feelsLike + "&deg;" + degreeLabel;
        small.appendChild(feelsLike);

        wrapper.appendChild(small);
    }

     $('.region.top.right').html(wrapper);
};

function updateWeather() {
    console.log('updateWeather');
    if (configCurrentWeather.appid === "") {
        Log.error("CurrentWeather: APPID not set!");
        return;
    }

    var url = configCurrentWeather.apiBase + configCurrentWeather.apiVersion + "/" + configCurrentWeather.weatherEndpoint + getParams();
    var self = this;
    var retry = false;

    var weatherRequest = new XMLHttpRequest();
    weatherRequest.open("GET", url, true);
    weatherRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                processWeather(JSON.parse(this.response));
            } else if (this.status === 401) {
                getDom();

                Log.error(self.name + ": Incorrect APPID.");
                retry = true;
            } else {
                Log.error(self.name + ": Could not load weather.");
            }

            if (retry) {
                self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
            }
        }
    };
    weatherRequest.send();
};

function addExtraInfoWeather(wrapper) {

    var small = document.createElement("div");
    small.className = "normal medium";

    var windIcon = document.createElement("span");
    windIcon.className = "wi wi-strong-wind dimmed";
    small.appendChild(windIcon);

    var windSpeed = document.createElement("span");
    windSpeed.innerHTML = " " + this.windSpeed;
    small.appendChild(windSpeed);

    if (configCurrentWeather.showWindDirection) {
        var windDirection = document.createElement("sup");
        if (configCurrentWeather.showWindDirectionAsArrow) {
            if(this.windDeg !== null) {
                windDirection.innerHTML = " &nbsp;<i class=\"fa fa-long-arrow-down\" style=\"transform:rotate("+this.windDeg+"deg);\"></i>&nbsp;";
            }
        } else {
            //windDirection.innerHTML = " " + this.translate(this.windDirection);
            windDirection.innerHTML = " " + this.windDirection;
        }
        small.appendChild(windDirection);
    }
    var spacer = document.createElement("span");
    spacer.innerHTML = "&nbsp;";
    small.appendChild(spacer);

    if (configCurrentWeather.showHumidity) {
        var humidity = document.createElement("span");
        humidity.innerHTML = this.humidity;

        var spacer = document.createElement("sup");
        spacer.innerHTML = "&nbsp;";

        var humidityIcon = document.createElement("sup");
        humidityIcon.className = "wi wi-humidity humidityIcon";
        humidityIcon.innerHTML = "&nbsp;";

        small.appendChild(humidity);
        small.appendChild(spacer);
        small.appendChild(humidityIcon);
    }

    var sunriseSunsetIcon = document.createElement("span");
    sunriseSunsetIcon.className = "wi dimmed " + this.sunriseSunsetIcon;
    small.appendChild(sunriseSunsetIcon);

    var sunriseSunsetTime = document.createElement("span");
    sunriseSunsetTime.innerHTML = " " + this.sunriseSunsetTime;
    small.appendChild(sunriseSunsetTime);

    wrapper.appendChild(small);
};

function getParams() {
    var params = "?";
    if(configCurrentWeather.locationID) {
        params += "id=" + configCurrentWeather.locationID;
    } else if(configCurrentWeather.location) {
        params += "q=" + configCurrentWeather.location;
    } else if (this.firstEvent && this.firstEvent.geo) {
        params += "lat=" + this.firstEvent.geo.lat + "&lon=" + this.firstEvent.geo.lon
    } else if (this.firstEvent && this.firstEvent.location) {
        params += "q=" + this.firstEvent.location;
    } else {
        this.hide(configCurrentWeather.animationSpeed, {lockString:this.identifier});
        return;
    }

    params += "&units=" + configCurrentWeather.units;
    params += "&lang=" + configCurrentWeather.lang;
    params += "&APPID=" + configCurrentWeather.appid;

    return params;
};

function processWeather(data) {

    if (!data || !data.main || typeof data.main.temp === "undefined") {
        // Did not receive usable new data.
        // Maybe this needs a better check?
        return;
    }

    this.humidity = parseFloat(data.main.humidity);
    this.temperature = this.roundValue(data.main.temp);
    this.feelsLike = 0;

    if (configCurrentWeather.useBeaufort){
        this.windSpeed = ms2Beaufort(this.roundValue(data.wind.speed));
    } else if (configCurrentWeather.useKMPHwind) {
        this.windSpeed = parseFloat((data.wind.speed * 60 * 60) / 1000).toFixed(0);
    } else {
        this.windSpeed = parseFloat(data.wind.speed).toFixed(0);
    }

    // ONLY WORKS IF TEMP IN C //
    var windInMph = parseFloat(data.wind.speed * 2.23694);

    var tempInF = 0;
    switch (configCurrentWeather.units){
        case "metric": tempInF = 1.8 * this.temperature + 32;
            break;
        case "imperial": tempInF = this.temperature;
            break;
        case "default":
            var tc = this.temperature - 273.15;
            tempInF = 1.8 * tc + 32;
            break;
    }

    if (windInMph > 3 && tempInF < 50){
        // windchill
        var windchillinF = Math.round(35.74+0.6215*tempInF-35.75*Math.pow(windInMph,0.16)+0.4275*tempInF*Math.pow(windInMph,0.16));
        var windChillInC = (windchillinF - 32) * (5/9);
        // this.feelsLike = windChillInC.toFixed(0);

        switch (configCurrentWeather.units){
            case "metric": this.feelsLike = windChillInC.toFixed(0);
                break;
            case "imperial": this.feelsLike = windChillInF.toFixed(0);
                break;
            case "default":
                var tc = windChillInC - 273.15;
                this.feelsLike = tc.toFixed(0);
                break;
        }

    } else if (tempInF > 80 && this.humidity > 40){
        // heat index
        var Hindex = -42.379 + 2.04901523*tempInF + 10.14333127*this.humidity
            - 0.22475541*tempInF*this.humidity - 6.83783*Math.pow(10,-3)*tempInF*tempInF
            - 5.481717*Math.pow(10,-2)*this.humidity*this.humidity
            + 1.22874*Math.pow(10,-3)*tempInF*tempInF*this.humidity
            + 8.5282*Math.pow(10,-4)*tempInF*this.humidity*this.humidity
            - 1.99*Math.pow(10,-6)*tempInF*tempInF*this.humidity*this.humidity;

        switch (configCurrentWeather.units){
            case "metric": this.feelsLike = Hindex.toFixed(0);
                break;
            case "imperial": this.feelsLike = parseFloat(Hindex * 1.8 + 32).toFixed(0);
                break;
            case "default":
                var tc = Hindex - 273.15;
                this.feelsLike = tc.toFixed(0);
                break;
        }
    } else {
        this.feelsLike = parseFloat(this.temperature).toFixed(0);
    }

    this.windDirection = this.deg2Cardinal(data.wind.deg);
    this.windDeg = data.wind.deg;
    this.weatherType = configCurrentWeather.iconTable[data.weather[0].icon];

    var now = new Date();
    var sunrise = new Date(data.sys.sunrise * 1000);
    var sunset = new Date(data.sys.sunset * 1000);

    // The moment().format('h') method has a bug on the Raspberry Pi.
    // So we need to generate the timestring manually.
    // See issue: https://github.com/MichMich/MagicMirror/issues/181
    var sunriseSunsetDateObject = (sunrise < now && sunset > now) ? sunset : sunrise;
    var timeString = moment(sunriseSunsetDateObject).format("HH:mm");
    if (configCurrentWeather.timeFormat !== 24) {
        //var hours = sunriseSunsetDateObject.getHours() % 12 || 12;
        if (configCurrentWeather.showPeriod) {
            if (configCurrentWeather.showPeriodUpper) {
                //timeString = hours + moment(sunriseSunsetDateObject).format(':mm A');
                timeString = moment(sunriseSunsetDateObject).format("h:mm A");
            } else {
                //timeString = hours + moment(sunriseSunsetDateObject).format(':mm a');
                timeString = moment(sunriseSunsetDateObject).format("h:mm a");
            }
        } else {
            //timeString = hours + moment(sunriseSunsetDateObject).format(':mm');
            timeString = moment(sunriseSunsetDateObject).format("h:mm");
        }
    }

    this.sunriseSunsetTime = timeString;
    this.sunriseSunsetIcon = (sunrise < now && sunset > now) ? "wi-sunset" : "wi-sunrise";

    //this.show(configCurrentWeather.animationSpeed, {lockString:this.identifier});
    this.loaded = true;
    getDom();
    //this.sendNotification("CURRENTWEATHER_DATA", {data: data});
};

function roundValue(temperature) {
    var decimals = configCurrentWeather.roundTemp ? 0 : 1;
    return parseFloat(temperature).toFixed(decimals);
}

function ms2Beaufort(ms) {
    var kmh = ms * 60 * 60 / 1000;
    var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
    for (var beaufort in speeds) {
        var speed = speeds[beaufort];
        if (speed > kmh) {
            return beaufort;
        }
    }
    return 12;
};

function deg2Cardinal(deg) {
    if (deg>11.25 && deg<=33.75){
        return "NNE";
    } else if (deg > 33.75 && deg <= 56.25) {
        return "NE";
    } else if (deg > 56.25 && deg <= 78.75) {
        return "ENE";
    } else if (deg > 78.75 && deg <= 101.25) {
        return "E";
    } else if (deg > 101.25 && deg <= 123.75) {
        return "ESE";
    } else if (deg > 123.75 && deg <= 146.25) {
        return "SE";
    } else if (deg > 146.25 && deg <= 168.75) {
        return "SSE";
    } else if (deg > 168.75 && deg <= 191.25) {
        return "S";
    } else if (deg > 191.25 && deg <= 213.75) {
        return "SSW";
    } else if (deg > 213.75 && deg <= 236.25) {
        return "SW";
    } else if (deg > 236.25 && deg <= 258.75) {
        return "WSW";
    } else if (deg > 258.75 && deg <= 281.25) {
        return "W";
    } else if (deg > 281.25 && deg <= 303.75) {
        return "WNW";
    } else if (deg > 303.75 && deg <= 326.25) {
        return "NW";
    } else if (deg > 326.25 && deg <= 348.75) {
        return "NNW";
    } else {
        return "N";
    }
};