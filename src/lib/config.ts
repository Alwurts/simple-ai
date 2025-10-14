export const siteConfig = {
	name: "simple-ai",
	url: "https://simple-ai.dev",
	ogImage: "https://simple-ai.dev/og.jpg",
	description:
		"AI Building Blocks that you can copy and paste into your apps. Customizable. Open Source.",
	links: {
		twitter: "https://twitter.com/alwurts",
		github: "https://github.com/Alwurts/simple-ai",
	},
	navItems: [
		{
			href: "/docs",
			label: "Docs",
		},
		{
			href: "/docs/components",
			label: "Components",
		},
		{
			href: "/blocks",
			label: "Blocks",
		},
		{
			href: "/ai-agents",
			label: "Agents",
		},
	],
	topLevelSections: [
		{ name: "Get Started", href: "/docs" },
		{ name: "Components", href: "/docs/components" },
		{ name: "Workflows", href: "/docs/workflows" },
	],
};

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
