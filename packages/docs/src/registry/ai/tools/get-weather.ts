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
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type GetWeatherResult = z.infer<typeof getWeatherResultSchema>;

export const getWeatherTool = tool({
	description: "Get the weather in a location (in Fahrenheit)",
	inputSchema: getWeatherParamsSchema,
	outputSchema: getWeatherResultSchema,
	execute: async (params) => {
		const temperature =
			params.unit === "fahrenheit"
				? 72 + Math.floor(Math.random() * 21) - 10
				: (72 + Math.floor(Math.random() * 21) - 10) * (5 / 9);

		return {
			success: true,
			message: `The weather in ${params.city} is ${temperature} degrees ${params.unit}`,
		};
	},
});

export type GetWeatherTool = InferUITool<typeof getWeatherTool>;
