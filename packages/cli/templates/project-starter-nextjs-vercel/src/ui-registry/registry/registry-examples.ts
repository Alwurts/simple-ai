import type { RegistryItem } from "./schema";

export const examples: RegistryItem[] = [
	// App Layout Examples
	{
		name: "app-layout-basic",
		type: "registry:example",
		title: "Basic Layout",
		description: "Simple layout with header and content using AppSidebar",
		files: [
			{
				path: "examples/app-layout-basic.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-layout-no-header",
		type: "registry:example",
		title: "Layout Without Header",
		description: "Minimal layout without header for cleaner interfaces",
		files: [
			{
				path: "examples/app-layout-no-header.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-layout-with-actions",
		type: "registry:example",
		title: "Layout with Header Actions",
		description: "Layout using AppLayoutHeaderActions for buttons and controls",
		files: [
			{
				path: "examples/app-layout-with-actions.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-layout-custom-sidebar",
		type: "registry:example",
		title: "Custom Sidebar",
		description: "Layout with a custom sidebar instead of the default AppSidebar",
		files: [
			{
				path: "examples/app-layout-custom-sidebar.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-layout-resizable",
		type: "registry:example",
		title: "Resizable Panels",
		description: "Layout with resizable primary and secondary panels",
		files: [
			{
				path: "examples/app-layout-resizable.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-layout-collapsed",
		type: "registry:example",
		title: "Collapsed Sidebar",
		description: "Layout that starts with sidebar collapsed by default",
		files: [
			{
				path: "examples/app-layout-collapsed.tsx",
				type: "registry:example",
			},
		],
	},
	// App Breadcrumbs Examples
	{
		name: "app-breadcrumbs-home",
		type: "registry:example",
		title: "With Home Link",
		description: "Basic breadcrumbs showing Home link (default behavior)",
		files: [
			{
				path: "examples/app-breadcrumbs-home.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-breadcrumbs-no-home",
		type: "registry:example",
		title: "Without Home Link",
		description: "Breadcrumbs without the default Home link using showHome=false",
		files: [
			{
				path: "examples/app-breadcrumbs-no-home.tsx",
				type: "registry:example",
			},
		],
	},
	{
		name: "app-breadcrumbs-nested",
		type: "registry:example",
		title: "Nested Navigation",
		description: "Multi-level breadcrumbs for deep navigation structures",
		files: [
			{
				path: "examples/app-breadcrumbs-nested.tsx",
				type: "registry:example",
			},
		],
	},
];
