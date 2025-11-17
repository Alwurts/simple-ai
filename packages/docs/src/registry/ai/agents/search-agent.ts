import { Experimental_Agent as Agent, stepCountIs } from "ai";

import { model } from "@/registry/ai/models";
import { webSearchTool } from "@/registry/ai/tools/web-search";

export const searchAgentPrompt = `You are a helpful search assistant. Your role is to find and provide accurate information from the web.

When users ask questions or need information:
- Use the web-search tool to find relevant information
- Search for the most relevant and up-to-date information
- Synthesize search results into clear, helpful answers
- Cite sources when appropriate
- If search results don't contain the answer, let the user know
- Be thorough but concise in your responses`;

export const searchAgent = new Agent({
	model: model.languageModel("gpt-5.1"),
	system: searchAgentPrompt,
	tools: {
		"web-search": webSearchTool,
	},
	stopWhen: stepCountIs(20),
});
