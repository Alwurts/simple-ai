import type { Registry } from "@/registry/schema";

export const blocks: Registry = [
	{
		name: "chat-01",
		description: "A simple chat page.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai"],
		registryDependencies: [
			"card",
			"breadcrumb",
			"separator",
			"sidebar",
			"tooltip",
			"button",
			"avatar",
			"dropdown-menu",
			"https://simple-ai.alwurts.com/registry/chat-input.json",
			"https://simple-ai.alwurts.com/registry/chat-message-area.json",
			"https://simple-ai.alwurts.com/registry/chat-message.json",
		],
		files: [
			{
				path: "blocks/chat-01/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-01/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-01/components/chat.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/sidebar-app.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/nav-user.tsx",
				type: "registry:component",
			},
		],
		categories: ["chat"],
	},
	{
		name: "chat-02",
		description: "A chat in a sidebar.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai"],
		registryDependencies: [
			"sidebar",
			"breadcrumb",
			"https://simple-ai.alwurts.com/registry/chat-input.json",
			"https://simple-ai.alwurts.com/registry/chat-message-area.json",
			"https://simple-ai.alwurts.com/registry/chat-message.json",
		],
		files: [
			{
				path: "blocks/chat-02/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-02/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-02/components/app-sidebar.tsx",
				type: "registry:component",
			},
		],
	},
	{
		name: "chat-03",
		description: "A chat in a popover.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai"],
		registryDependencies: [
			"popover",
			"button",
			"https://simple-ai.alwurts.com/registry/chat-input.json",
			"https://simple-ai.alwurts.com/registry/chat-message-area.json",
			"https://simple-ai.alwurts.com/registry/chat-message.json",
		],
		files: [
			{
				path: "blocks/chat-03/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-03/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-03/components/chat.tsx",
				type: "registry:component",
			},
		],
	},
];
