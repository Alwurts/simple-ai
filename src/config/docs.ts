import type { MainNavItem, SidebarNavItem } from "@/types/nav";

export interface DocsConfig {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
	mainNav: [
		{
			title: "Home",
			href: "/",
		},
		{
			title: "Documentation",
			href: "/docs",
		},
		{
			title: "Components",
			href: "/docs/components/chat-input",
		},
		{
			title: "Blocks",
			href: "/blocks",
		},
		{
			title: "Agents",
			href: "/ai-agents",
		},
	],
	sidebarNav: [
		{
			title: "Getting Started",
			items: [
				{
					title: "Introduction",
					href: "/docs",
					items: [],
				},
				{
					title: "Installation",
					href: "/docs/installation",
					items: [],
				},
				{
					title: "Blocks",
					href: "/docs/blocks",
					items: [],
				},
				{
					title: "React Flow",
					href: "/docs/react-flow",
					items: [],
				},
			],
		},
		{
			title: "Components",
			items: [
				{
					title: "Chat Input",
					href: "/docs/components/chat-input",
					items: [],
				},
				{
					title: "Chat Message",
					href: "/docs/components/chat-message",
					items: [],
				},
				{
					title: "Chat Message Area",
					href: "/docs/components/chat-message-area",
					items: [],
				},
				{
					title: "JSX Renderer",
					href: "/docs/components/jsx-renderer",
					items: [],
				},
				{
					title: "Markdown Content",
					href: "/docs/components/markdown-content",
					items: [],
				},
				{
					title: "Model Selector",
					href: "/docs/components/model-selector",
					items: [],
				},
			],
		},
		{
			title: "React Flow Components",
			items: [
				{
					title: "Editable Handle",
					href: "/docs/react-flow/components/editable-handle",
					items: [],
				},
				{
					title: "Generate Text Node",
					href: "/docs/react-flow/components/generate-text-node",
					items: [],
				},
				{
					title: "Prompt Crafter Node",
					href: "/docs/react-flow/components/prompt-crafter-node",
					items: [],
				},
				{
					title: "Resizable Node",
					href: "/docs/react-flow/components/resizable-node",
					items: [],
				},
				{
					title: "Status Edge",
					href: "/docs/react-flow/components/status-edge",
					items: [],
				},
				{
					title: "Text Input Node",
					href: "/docs/react-flow/components/text-input-node",
					items: [],
				},
				{
					title: "Visualize Text Node",
					href: "/docs/react-flow/components/visualize-text-node",
					items: [],
				},
			],
		},
	],
};
