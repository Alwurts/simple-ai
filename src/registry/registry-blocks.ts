import type { Registry } from "@/registry/schema";

export const blocks: Registry = [
	{
		name: "chat-01",
		description: "A simple chat page.",
		type: "registry:block",
		registryDependencies: ["button", "card", "input", "label"],
		files: [
			{
				path: "blocks/chat-01/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-01/components/chat.tsx",
				type: "registry:component",
			},
		],
		categories: ["chat"],
	},
];
