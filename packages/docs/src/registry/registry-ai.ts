import type { Registry } from "@/shadcn-temp/schema";

const agents: Registry["items"] = [
	{
		name: "agents",
		description: "A set of default agents.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: [
			"@simple-ai/models",
			"@simple-ai/weather-agent",
			"@simple-ai/firecrawl-agent",
			"@simple-ai/id-to-readable-text",
		],
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/agents.ts",
				target: "lib/ai/agents.ts",
			},
		],
	},
	{
		title: "Weather Agent",
		name: "weather-agent",
		description: "A weather agent with tools for getting the weather.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: ["@simple-ai/models", "@simple-ai/get-weather"],
		categories: ["agent"],
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/weather-agent.ts",
				target: "lib/ai/agents/weather-agent.ts",
			},
		],
		meta: {
			icon: "CloudRain",
			toolIds: ["get-weather"],
			suggestions: [
				"What's the weather like in New York today?",
				"Will it rain in London tomorrow?",
				"What's the forecast for Tokyo next week?",
				"How's the weather in Paris right now?",
			],
			prompt: "You are a helpful weather assistant. Your role is to provide accurate and helpful weather information to users.\n\nWhen users ask about weather:\n- Use the get-weather tool to retrieve current weather conditions\n- Always specify the city and preferred temperature unit (fahrenheit or celsius)\n- Provide clear, concise weather information\n- If a user doesn't specify a unit, default to fahrenheit\n- Be friendly and helpful in your responses",
		},
	},
	{
		title: "Firecrawl Agent",
		name: "firecrawl-agent",
		description: "A web research agent powered by Firecrawl.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: [
			"@simple-ai/models",
			"@simple-ai/firecrawl-tool",
		],
		categories: ["agent"],
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/firecrawl-agent.ts",
				target: "lib/ai/agents/firecrawl-agent.ts",
			},
		],
		meta: {
			icon: "FirecrawlIcon",
			toolIds: ["firecrawl"],
			suggestions: [
				"Scrape https://example.com",
				"Search for recent news about AI agents",
				"Find documentation for the Vercel AI SDK",
				"Get content from a specific URL",
			],
			prompt: "You are a web research assistant powered by Firecrawl.\nYour goal is to find accurate information from the web efficiently.\n\nInstructions:\n- If the user provides a specific URL, use the 'scrape' mode to get the content.\n- If the user asks a general question, use the 'search' mode to find relevant pages.\n- The tool returns Markdown content. Summarize this content clearly for the user.\n- Cite the URLs you found information from.",
		},
	},
];

const tools: Registry["items"] = [
	{
		name: "tools",
		description: "A set of tools for the AI SDK.",
		type: "registry:lib",
		registryDependencies: [
			"@simple-ai/firecrawl-tool",
			"@simple-ai/get-weather",
		],
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/tools/tools.ts" }],
	},
	{
		name: "get-weather",
		description: "A tool for getting the weather.",
		type: "registry:lib",
		dependencies: ["ai", "zod"],
		files: [{ type: "registry:lib", path: "ai/tools/get-weather.ts" }],
	},
	{
		name: "firecrawl-tool",
		envVars: {
			FIRECRAWL_API_KEY: "",
		},
		description:
			"A tool for searching and scraping the web using Firecrawl.",
		type: "registry:lib",
		dependencies: ["ai", "@mendable/firecrawl-js", "zod"],
		files: [{ type: "registry:lib", path: "ai/tools/firecrawl.ts" }],
	},
];

const lib: Registry["items"] = [
	{
		name: "agent-respond",
		description: "A function to respond to a message with an agent.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: ["@simple-ai/id-to-readable-text"],
		files: [{ type: "registry:lib", path: "ai/agent-route-respond.ts" }],
	},

	{
		name: "models",
		description: "A set of models for the AI SDK.",
		type: "registry:lib",
		dependencies: ["ai", "@ai-sdk/openai"],
		files: [{ type: "registry:lib", path: "ai/models.ts" }],
	},
	{
		name: "messages",
		description: "UIMessage types for the AI SDK.",
		type: "registry:lib",
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/messages.ts" }],
	},
	{
		name: "ai-utils",
		description: "A set of utilities for the AI SDK.",
		type: "registry:lib",
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/ai-utils.ts" }],
	},
];

export const ai: Registry["items"] = [...agents, ...tools, ...lib];
