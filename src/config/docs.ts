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
					title: "Markdown Content",
					href: "/docs/components/markdown-content",
					items: [],
				},
				{
					title: "JSX Renderer",
					href: "/docs/components/jsx-renderer",
					items: [],
				},
			],
		},
	],
};
