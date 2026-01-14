import type { RegistryItem } from "./schema";

export const ui: RegistryItem[] = [
	// Button variants are now in examples/
	// Individual button variants are registered in registry-examples.ts
	{
		name: "app-layout",
		type: "registry:ui",
		title: "App Layout",
		description:
			"A comprehensive layout system with sidebar navigation, resizable panels, and organized content areas.",
		files: [
			{
				path: "ui/app-layout.tsx",
				type: "registry:ui",
			},
		],
		registryDependencies: ["button", "resizable", "separator", "sidebar"],
	},
	{
		name: "app-breadcrumbs",
		type: "registry:ui",
		title: "App Breadcrumbs",
		description: "A breadcrumb component for the application.",
		files: [
			{
				path: "ui/app-breadcrumbs.tsx",
				type: "registry:ui",
			},
		],
		registryDependencies: ["breadcrumb"],
	},
];
