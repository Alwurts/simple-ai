import type { Registry } from "@/registry/schema";

export const examples: Registry = [
	{
		name: "chat-input-demo",
		type: "registry:example",
		registryDependencies: ["https://ai.alwurts.com/registry/chat-input.json"],
		files: [
			{
				path: "examples/chat-input-demo.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "markdown-content-demo",
		type: "registry:example",
		files: [
			{
				path: "examples/markdown-content-demo.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "markdown-streaming-demo",
		type: "registry:example",
		files: [
			{
				path: "examples/markdown-streaming-demo.tsx",
				type: "registry:example",
			},
		],
	},
];
