import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { registryCategories } from "@/registry/registry-categories";
import { docsConfig } from "@/config/docs";

function getAllDocRoutes(
	items: (typeof docsConfig.sidebarNav)[number]["items"],
): string[] {
	return items.reduce<string[]>((acc, item) => {
		if (item.href) {
			acc.push(item.href);
		}
		if (item.items?.length) {
			acc.push(...getAllDocRoutes(item.items));
		}
		return acc;
	}, []);
}

export default function sitemap(): MetadataRoute.Sitemap {
	// Base routes
	const routes = ["", "/blocks", "/docs"];

	// Add block category routes
	const blockCategoryRoutes = registryCategories.map(
		(category) => `/blocks/${category.slug}`,
	);

	// Add documentation routes
	const docRoutes = getAllDocRoutes(
		docsConfig.sidebarNav.flatMap((section) => section.items),
	);

	// Combine all routes
	const allRoutes = [...routes, ...blockCategoryRoutes, ...docRoutes];

	return allRoutes.map((route) => ({
		url: `${siteConfig.url}${route}`,
		lastModified: new Date().toISOString(),
		changeFrequency: "daily",
		priority:
			route === ""
				? 1
				: route.startsWith("/blocks")
					? 0.8
					: route.startsWith("/docs")
						? 0.9
						: 0.5,
	})) as MetadataRoute.Sitemap;
}
