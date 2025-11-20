import { type InferUITool, tool } from "ai";
import { z } from "zod";

const getWeatherParamsSchema = z.object({
	city: z.string().describe("The city to get the weather for"),
	unit: z.enum(["fahrenheit", "celsius"]).describe("The unit of temperature"),
});

export type GetWeatherParams = z.infer<typeof getWeatherParamsSchema>;

const getWeatherResultSchema = z.union([
	z.object({
		success: z.literal(true),
		message: z.string(),
		temperature: z.number(),
		windSpeed: z.number(),
		weatherCode: z.number(),
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type GetWeatherResult = z.infer<typeof getWeatherResultSchema>;

export const getWeatherTool = tool({
	name: "get-weather",
	description: "Get the current weather in a location",
	inputSchema: getWeatherParamsSchema,
	outputSchema: getWeatherResultSchema,
	execute: async (params) => {
		try {
			const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(params.city)}&count=1&language=en&format=json`;
			const geocodeResponse = await fetch(geocodeUrl);
			const geocodeData = await geocodeResponse.json();

			if (!geocodeData.results || geocodeData.results.length === 0) {
				return {
					success: false,
					error: `Could not find location: ${params.city}`,
				};
			}

			const { latitude, longitude } = geocodeData.results[0];

			const tempUnit =
				params.unit === "celsius" ? "celsius" : "fahrenheit";
			const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=${tempUnit}`;
			const weatherResponse = await fetch(weatherUrl);
			const weatherData = await weatherResponse.json();

			const temperature = weatherData.current.temperature_2m;
			const windSpeed = weatherData.current.windspeed_10m;
			const weatherCode = weatherData.current.weathercode;

			const weatherDescriptions: Record<number, string> = {
				0: "Clear sky",
				1: "Mainly clear",
				2: "Partly cloudy",
				3: "Overcast",
				45: "Foggy",
				48: "Depositing rime fog",
				51: "Light drizzle",
				53: "Moderate drizzle",
				55: "Dense drizzle",
				61: "Slight rain",
				63: "Moderate rain",
				65: "Heavy rain",
				71: "Slight snow",
				73: "Moderate snow",
				75: "Heavy snow",
				77: "Snow grains",
				80: "Slight rain showers",
				81: "Moderate rain showers",
				82: "Violent rain showers",
				85: "Slight snow showers",
				86: "Heavy snow showers",
				95: "Thunderstorm",
				96: "Thunderstorm with slight hail",
				99: "Thunderstorm with heavy hail",
			};

			const weatherDescription =
				weatherDescriptions[weatherCode] || "Unknown";

			return {
				success: true,
				message: `The weather in ${params.city} is ${temperature}°${params.unit === "celsius" ? "C" : "F"} with ${weatherDescription.toLowerCase()}. Wind speed: ${windSpeed} km/h`,
				temperature,
				windSpeed,
				weatherCode,
			};
		} catch (error) {
			return {
				success: false,
				error: `Failed to fetch weather data: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	},
});

export type GetWeatherTool = InferUITool<typeof getWeatherTool>;
