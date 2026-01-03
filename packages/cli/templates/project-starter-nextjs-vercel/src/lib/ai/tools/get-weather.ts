import { tool } from "ai";
import { z } from "zod";

const getWeatherInputSchema = z.object({
	location: z.string().describe("The city or location to get weather for"),
});

const getWeatherOutputSchema = z.object({
	temperature: z.number(),
	condition: z.string(),
	humidity: z.number(),
	windSpeed: z.number(),
});

export type GetWeatherOutput = z.infer<typeof getWeatherOutputSchema>;

export const weatherTool = tool({
	description: "Get current weather information for a location",
	inputSchema: getWeatherInputSchema,
	outputSchema: getWeatherOutputSchema,
	execute: async () => {
		return {
			temperature: 20,
			condition: "sunny",
			humidity: 50,
			windSpeed: 10,
		};
	},
});
