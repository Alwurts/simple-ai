import { Experimental_Agent as Agent, stepCountIs } from "ai";

import { model } from "@/registry/ai/models";
import { webSearchTool } from "@/registry/ai/tools/web-search";

export const searchAgent = new Agent({
	model: model.languageModel("gpt-5.1"),
	tools: {
		"web-search": webSearchTool,
	},
	stopWhen: stepCountIs(20),
});
