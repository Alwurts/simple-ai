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
			"@simple-ai/search-agent",
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
		title: "Search Agent",
		name: "search-agent",
		description: "A search agent with tools for web searching.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: ["@simple-ai/models", "@simple-ai/web-search"],
		categories: ["agent"],
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/search-agent.ts",
				target: "lib/ai/agents/search-agent.ts",
			},
		],
		meta: {
			icon: "Search",
			toolIds: ["web-search"],
			suggestions: [
				"Search for the latest AI news",
				"Find information about React hooks",
				"What are the current trends in web development?",
				"Search for recipes for chocolate chip cookies",
			],
			prompt: "You are a helpful search assistant. Your role is to find and provide accurate information from the web.\n\nWhen users ask questions or need information:\n- Use the web-search tool to find relevant information\n- Search for the most relevant and up-to-date information\n- Synthesize search results into clear, helpful answers\n- Cite sources when appropriate\n- If search results don't contain the answer, let the user know\n- Be thorough but concise in your responses",
		},
	},
];

const tools: Registry["items"] = [
	{
		name: "tools",
		description: "A set of tools for the AI SDK.",
		type: "registry:lib",
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/tools/tools.ts" }],
	},
	{
		name: "get-weather",
		description: "A tool for getting the weather.",
		type: "registry:lib",
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/tools/get-weather.ts" }],
	},
	{
		name: "web-search",
		description: "A tool for searching the web.",
		type: "registry:lib",
		dependencies: ["ai"],
		files: [{ type: "registry:lib", path: "ai/tools/web-search.ts" }],
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
