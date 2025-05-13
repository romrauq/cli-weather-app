const axios = require("axios");
const inquirer = require("inquirer");
const { getNames } = require("country-list");

// Register autocomplete prompt
inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));

// === CONFIG ===
const API_KEY = process.env.OPEN_WEATHER_API_KEY;

// Example static city data (you can replace with a more dynamic or API-based source)
const citiesByCountry = {
	Ghana: ["Accra", "Kumasi", "Tamale", "Takoradi"],
	"United States": ["New York", "Los Angeles", "Chicago", "Houston"],
	"United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool"],
	Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
};

// Function to fetch weather
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

// Autocomplete search functions
function searchCountries(answers, input) {
	input = input || "";
	const countries = getNames();
	return Promise.resolve(
		countries.filter((country) => country.toLowerCase().includes(input.toLowerCase()))
	);
}

function searchCities(answers, input) {
	input = input || "";
	const country = answers.country;
	const cities = citiesByCountry[country] || [];
	return Promise.resolve(
		cities.filter((city) => city.toLowerCase().includes(input.toLowerCase()))
	);
}

// Main CLI flow
async function main() {
	console.log("=== Weather CLI with Autocomplete ===");

	const answers = await inquirer.prompt([
		{
			type: "autocomplete",
			name: "country",
			message: "Select a Country:",
			source: searchCountries,
		},
		{
			type: "autocomplete",
			name: "city",
			message: "Select a City within the Country:",
			source: searchCities,
		},
	]);

	console.log(`\nFetching weather for ${answers.city}, ${answers.country}...`);

	const weatherData = await getWeather(answers.country, answers.city);

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
