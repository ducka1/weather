// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

const API_KEY = '&appid=383a3b98025b5a113781a5a984a16b5c';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const COORD_URL = 'https://api.openweathermap.org/geo/1.0/direct'

function getCityData(city) {
    return parseCoords(constructCoords(city))
    .then(coords => constructWeather(coords[0], coords[1]))
    .then(url => parseWeather(url));
}

function constructCoords(city) {
    return COORD_URL + '?q=' + city + '&limit=1' + API_KEY;
}

async function parseCoords(URL) {
    try {
        const response = await fetch(URL, {mode: 'cors'});
        const coordData = await response.json();

        const lat = coordData[0]['lat']; // deg
        const lon = coordData[0]['lon']; // deg
        return [lat, lon];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

function constructWeather(lat, lon) {
    return WEATHER_URL + '?lat=' + lat + '&lon=' + lon + API_KEY;
}

async function parseWeather(URL) {
    try {
        const response = await fetch(URL, {mode: 'cors'});
        const weatherData = await response.json();
        
        const weatherGen = weatherData['weather'][0]['main'];
        const weatherDesc = weatherData['weather'][0]['description'];
        let tempActual = weatherData['main']['temp']; // Kelvin
        let tempFeels = weatherData['main']['feels_like']; // Kelvin
        const humidity = weatherData['main']['humidity']; // %
        const pressure = weatherData['main']['pressure']; // hPa
        let windSpeed = weatherData['wind']['speed']; // m/s
        const country = weatherData['sys']['country']; // country code
        
        tempActual = roundTo2Decimals(kelvinToCelsius(tempActual));
        tempFeels = roundTo2Decimals(kelvinToCelsius(tempFeels));
        windSpeed = roundTo2Decimals(windSpeed);
        return [weatherGen, weatherDesc, tempActual, tempFeels, humidity, pressure, windSpeed, country];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

function showToDom(stats, userInput) {
    const container = document.querySelector('#data-container');
    container.textContent = '';
    let lines = [];

    for (let i = 0; i < 6; i++) {
        lines.push(document.createElement('h1'));
    }

    lines[0].textContent = `Weather in ${userInput}, ${stats[7]}`;
    lines[1].textContent = `${stats[0]}: ${stats[1]}`;
    lines[2].textContent = `Temperature: ${stats[2]}°C, feels like ${stats[3]}°C`;
    lines[3].textContent = `Humidity: ${stats[4]}%`;
    lines[4].textContent = `Pressure: ${stats[5]} hPa`;
    lines[5].textContent = `Wind speed: ${stats[6]} m/s`;

    lines[0].style.cssText = 'margin-bottom: 30px;'

    for (let idx in lines) {
        container.appendChild(lines[idx]);
    }
}

function setBackground(status) { 
    const body = document.querySelector('body');
    if (status == 'Clear') {
        body.style.cssText = 'background-image: url(./images/clear.jpg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
    else if (status == 'Clouds') {
        body.style.cssText = 'background-image: url(./images/clouds.jpeg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
    else if (status == 'Drizzle') {
        body.style.cssText = 'background-image: url(./images/drizzle.jpg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
    else if (status == 'Rain') {
        body.style.cssText = 'background-image: url(./images/rain.jpg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
    else if (status == 'Snow') {
        body.style.cssText = 'background-image: url(./images/snow.jpg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
    else if (status == 'Thunderstorm') {
        body.style.cssText = 'background-image: url(./images/thunderstorm.jpg); background-repeat: no-repeat; background-attachment: fixed; background-size: cover;'
    }
}

function roundTo2Decimals(n) {
    return Math.round(n * 100) / 100;
}

function kelvinToCelsius(kelvinTemp) {
    return celsiusTemp = kelvinTemp - 273.15;
}

addEventListener('submit', async (e) => {
    const container = document.querySelector('#data-container');
    try {
        const userInput = document.querySelector('#search-input').value;
        const city = userInput.toLowerCase();
        const stats = await getCityData(city);
        showToDom(stats, userInput);
        setBackground(stats[0]);
    } catch (error) {
        console.log(`Error: ${error}`)
        container.textContent = '';
        const warning = document.createElement('h1');
        warning.textContent = 'No such city found';
        container.appendChild(warning);
    }
});

