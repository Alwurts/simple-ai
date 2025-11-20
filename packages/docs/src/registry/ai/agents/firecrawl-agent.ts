import { Experimental_Agent as Agent, stepCountIs } from "ai";

import { model } from "@/registry/ai/models";
import { firecrawlTool } from "@/registry/ai/tools/firecrawl";

export const firecrawlAgentPrompt = `You are a web research assistant powered by Firecrawl.

Your goal is to find accurate information from the web efficiently.

Instructions:

- If the user provides a specific URL, use the 'scrape' mode to get the content.

- If the user asks a general question, use the 'search' mode to find relevant pages.

- The tool returns Markdown content. Summarize this content clearly for the user.

- Cite the URLs you found information from.`;

export const firecrawlAgent = new Agent({
	model: model.languageModel("gpt-5-nano"),
	system: firecrawlAgentPrompt,
	tools: {
		firecrawl: firecrawlTool,
	},
	stopWhen: stepCountIs(10), // Low step count to keep it cheap
});
