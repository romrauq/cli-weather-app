require("dotenv").config();
const axios = require("axios");
const readline = require("readline-sync");

const API_KEY = process.env.OPEN_WEATHER_API_KEY;

async function getWeather(country, city) {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
		city
	)},${encodeURIComponent(country)}&appid=${API_KEY}&units=metric`;

	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		if (error.response) {
			console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
		} else {
			console.error("Error fetching weather:", error.message);
		}
	}
}

async function main() {
	console.log("=== Weather CLI ===");

	const country = readline.question("Enter Country: ").trim();
	const city = readline.question("Enter City within the Country: ").trim();

	if (!country || !city) {
		console.log("Country and City cannot be empty.");
		return;
	}

	console.log(`Fetching weather for ${city}, ${country}...`);

	const weatherData = await getWeather(country, city);

	if (weatherData && weatherData.weather) {
		console.log(`\nWeather in ${weatherData.name}, ${weatherData.sys.country}:`);
		console.log(`Temperature: ${weatherData.main.temp}°C`);
		console.log(`Weather: ${weatherData.weather[0].description}`);
		console.log(`Humidity: ${weatherData.main.humidity}%`);
		console.log(`Wind Speed: ${weatherData.wind.speed} m/s`);
	} else {
		console.log("Could not retrieve weather data. Please check the country and city names.");
	}
}

main();
