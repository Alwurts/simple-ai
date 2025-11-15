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
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/weather-agent.ts",
				target: "lib/ai/agents/weather-agent.ts",
			},
		],
	},
	{
		title: "Search Agent",
		name: "search-agent",
		description: "A search agent with tools for web searching.",
		type: "registry:lib",
		dependencies: ["ai"],
		registryDependencies: ["@simple-ai/models", "@simple-ai/web-search"],
		files: [
			{
				type: "registry:lib",
				path: "ai/agents/search-agent.ts",
				target: "lib/ai/agents/search-agent.ts",
			},
		],
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
