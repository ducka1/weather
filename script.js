// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

const API_KEY = '&appid=383a3b98025b5a113781a5a984a16b5c';
const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';
const COORD_URL = 'http://api.openweathermap.org/geo/1.0/direct'

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

        const weatherDesc = weatherData['weather'][0]['description'];
        const tempActual = weatherData['main']['temp']; // Kelvin
        const tempFeels = weatherData['main']['feels_like']; // Kelvin
        const humidity = weatherData['main']['humidity']; // %
        const pressure = weatherData['main']['pressure']; // hPa
        const windSpeed = weatherData['wind']['speed']; // m/s
        const country = weatherData['sys']['country']; // country code

        return [weatherDesc, tempActual, tempFeels, humidity, pressure, windSpeed, country];
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

function showToDom(stats) {
    const container = document.querySelector('#data-container');
    container.textContent = '';
    for (let idx in stats) {
        const para = document.createElement('p');
        para.textContent = stats[idx];
        container.appendChild(para);
    }
}

addEventListener('submit', async (e) => {
    const userInput = document.querySelector('#search-input').value;
    const city = userInput.toLowerCase().replace(/\s/g, '');
    const stats = await getCityData(city);
    showToDom(stats);
});

