console.log('currentweather');

const configCurrentWeather =  {
    location: false,
        locationID: false,
        appid: "",
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


