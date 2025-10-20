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

function getBaseUrl() {
	// 1) Explicit public base URL takes precedence
	const explicit = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
	if (explicit && /^https?:\/\//.test(explicit)) {
		return explicit.replace(/\/$/, "");
	}

	// 2) Vercel-provided URL (no protocol), prefer https
	const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
	if (vercelUrl) {
		return `https://${vercelUrl.replace(/\/$/, "")}`;
	}

	// 3) Fallback to configured site URL if present
	if (siteConfig?.url) {
		return siteConfig.url.replace(/\/$/, "");
	}

	// 4) Local development fallback
	const port = process.env.PORT || "4567";
	return `http://localhost:${port}`;
}

export const BASE_URL = getBaseUrl();
