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
			href: "/agents",
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
					href: "/docs/components/react-flow/editable-handle",
					items: [],
				},
				{
					title: "Generate Text Node",
					href: "/docs/components/react-flow/generate-text-node",
					items: [],
				},
				{
					title: "Prompt Crafter Node",
					href: "/docs/components/react-flow/prompt-crafter-node",
					items: [],
				},
				{
					title: "Resizable Node",
					href: "/docs/components/react-flow/resizable-node",
					items: [],
				},
				{
					title: "Status Edge",
					href: "/docs/components/react-flow/status-edge",
					items: [],
				},
				{
					title: "Text Input Node",
					href: "/docs/components/react-flow/text-input-node",
					items: [],
				},
				{
					title: "Visualize Text Node",
					href: "/docs/components/react-flow/visualize-text-node",
					items: [],
				},
			],
		},
	],
};
