import { Experimental_Agent as Agent, stepCountIs } from "ai";

import { model } from "@/registry/ai/models";
import { getWeatherTool } from "@/registry/ai/tools/get-weather";

export const weatherAgentPrompt = `You are a helpful weather assistant. Your role is to provide accurate and helpful weather information to users.

When users ask about weather:
- Use the get-weather tool to retrieve current weather conditions
- Always specify the city and preferred temperature unit (fahrenheit or celsius)
- Provide clear, concise weather information
- If a user doesn't specify a unit, default to fahrenheit
- Be friendly and helpful in your responses`;

export const weatherAgent = new Agent({
	model: model.languageModel("gpt-5-nano"),
	system: weatherAgentPrompt,
	tools: {
		"get-weather": getWeatherTool,
	},
	stopWhen: stepCountIs(20),
});
