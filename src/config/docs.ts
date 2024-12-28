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
			],
		},
	],
};
