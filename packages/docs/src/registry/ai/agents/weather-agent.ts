import { Experimental_Agent as Agent, stepCountIs } from "ai";

import { model } from "@/registry/ai/models";
import { getWeatherTool } from "@/registry/ai/tools/get-weather";

export const weatherAgent = new Agent({
	model: model.languageModel("gpt-5.1"),
	tools: {
		"get-weather": getWeatherTool,
	},
	stopWhen: stepCountIs(20),
});
