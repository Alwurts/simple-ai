export const siteConfig = {
	name: "aimple-ai",
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
			href: "/docs/installation",
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
	],
};

export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
