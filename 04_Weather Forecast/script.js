
const temperature = document.getElementById("temperature")
const name = document.getElementById("city-name")
const weather = document.getElementById("weather-description")
const input = document.getElementById("city-input")
const search = document.getElementById("search-btn")

const humidity = document.getElementById("Humidity")
const wind = document.getElementById("Wind")
const pressure = document.getElementById("Pressure")
const index = document.getElementById("Index")

const description = document.getElementById("weather-description")
const avgtemp = document.getElementById("feels-like")
const weatherIcon = document.getElementById("weather-icon");

// background Changing - 
const weatherBackgrounds = {
    0: "sunny",
    1: "sunny",
    2: "sunny",

    3: "cloudy",

    45: "fog",
    48: "fog",

    51: "rain",
    53: "rain",
    55: "rain",

    61: "rain",
    63: "rain",
    65: "rain",

    71: "snow",
    73: "snow",
    75: "snow",

    95: "storm",
    96: "storm",
    99: "storm"
};

const weatherDescriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Fog",

    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",

    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",

    71: "Snow",
    73: "Heavy Snow",

    95: "Thunderstorm"
};
const weatherIcons = {
    // Clear
    0: "☀️",     // Clear Sky
    1: "🌤️",     // Mainly Clear
    2: "⛅",      // Partly Cloudy
    3: "☁️",      // Overcast

    // Fog
    45: "🌫️",
    48: "🌫️",

    // Drizzle
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",

    // Rain
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",

    // Snow
    71: "🌨️",
    73: "❄️",
    75: "❄️",

    // Thunderstorm
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
};

async function getCoordinates(city) {
    const url =`https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return {
    longitude : data.results[0].longitude,
    latitude : data.results[0].latitude
    };
}
function updateUI(weatherData) {
    name.textContent = weatherData.city;
    weatherIcon.textContent = weatherIcons[weatherData.weatherCode];
    document.body.classList.remove(
    "sunny",
    "rain",
    "night",
    "cloudy",
    "fog",
    "snow",
    "storm");

    document.body.classList.add(
        weatherBackgrounds[weatherData.weatherCode]
    );

    temperature.textContent = weatherData.temperature + "°";
    humidity.textContent = weatherData.humidity + "%";
    wind.textContent = weatherData.wind + " Km/H";
    pressure.textContent = weatherData.pressure + " mb";
    index.textContent = weatherData.uv;

    description.textContent =weatherDescriptions[weatherData.weatherCode];
    avgtemp.textContent =`Feels Like ${Math.round(weatherData.feelsLike)}°`;
}
async function getWeather(latitude,longitude,city) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,uv_index,apparent_temperature,weather_code&hourly=temperature_2m,weather_code`;
    const response = await fetch(url);
    const data = await response.json()
    const hourlyList = document.querySelector(".hourly-list");
    hourlyList.innerHTML = "";

    for(let i = 0;i<10;i++){
        const card = document.createElement("div")
        card.classList.add("hour-card")
        console.log(card);
        const time = document.createElement("span");
        const icon = document.createElement("div");
        const temp = document.createElement("p");

        card.append(time,icon,temp);
        hourlyList.appendChild(card);

        const temperature = data.hourly.temperature_2m[i];
        const weatherCode = data.hourly.weather_code[i];
        const iconEmoji = weatherIcons[weatherCode];
        const weathertime = data.hourly.time[i];
        const date = new Date(weathertime);
        const formattedTime = date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true
        });
        console.log(i);
        time.textContent = formattedTime;
        icon.textContent = iconEmoji;
        temp.textContent = temperature+"°";
    }

    console.log(data.hourly);


    const current = data.current;
    const weatherData = {
    city,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    wind: data.current.wind_speed_10m,
    pressure: data.current.surface_pressure,
    uv: data.current.uv_index,
    weatherCode: data.current.weather_code};

    updateUI(weatherData);
    localStorage.setItem("lastweather",JSON.stringify(weatherData));

    // Hourly list -- 

}

async function startApp(city) {
    const {latitude,longitude} = await getCoordinates(city)
    await getWeather(latitude,longitude,city)
}

search.addEventListener("click",async()=>{
    console.log("button Clicked")
    const city = input.value.trim()
    if (city == ""){
        return
    }
    
    await startApp(city)
    input.value = ""
})

const lastweather = JSON.parse(localStorage.getItem("lastweather"));
if (lastweather){
    updateUI(lastweather)
}


// DARK MODE - 
const button = document.getElementById("theme")
button.addEventListener("click",()=>{
    document.body.classList.toggle("dark")

    if (document.body.classList.contains("dark")){
        button.textContent = "☀️";
        button.style.background = "white"
    }
    else{
        button.textContent = "🌙"
        button.style.background = "black"
    }
})
