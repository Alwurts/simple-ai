export const siteConfig = {
	name: "simple-ai",
	url: "https://simple-ai.dev",
	ogImage: "https://simple-ai.dev/og.jpg",
	description:
		"AI Building Blocks that you can copy and paste into your apps. Customizable. Open Source.",
	links: {
		twitter: "https://x.com/alwurts",
		github: "https://github.com/Alwurts/simple-ai",
	},
	navItems: [
		{
			href: "/docs",
			label: "Documentation",
		},
		{
			href: "/docs/components/chat-input",
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

const resolvedBase =
	process.env.NEXT_PUBLIC_BASE_URL ||
	(process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: undefined) ||
	`http://localhost:${process.env.PORT || "4567"}`;

export const BASE_URL = resolvedBase.replace(/\/$/, "");
