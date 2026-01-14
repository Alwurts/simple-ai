import type { RegistryItem } from "./schema";

export const examples: RegistryItem[] = [
	{
		name: "button-default",
		type: "registry:example",
		title: "Default Button",
		description: "A standard button with the default styling.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-default.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
	{
		name: "button-secondary",
		type: "registry:example",
		title: "Secondary Button",
		description: "A secondary button with muted styling.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-secondary.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
	{
		name: "button-outline",
		type: "registry:example",
		title: "Outline Button",
		description: "A button with an outline border and transparent background.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-outline.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
	{
		name: "button-ghost",
		type: "registry:example",
		title: "Ghost Button",
		description: "A subtle button with minimal styling.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-ghost.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
	{
		name: "button-destructive",
		type: "registry:example",
		title: "Destructive Button",
		description: "A button for destructive actions, typically red.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-destructive.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
	{
		name: "button-link",
		type: "registry:example",
		title: "Link Button",
		description: "A button styled to look like a text link.",
		registryDependencies: ["@/components/ui/button"],
		files: [
			{
				path: "examples/button-link.tsx",
				type: "registry:ui",
				target: "",
			},
		],
		categories: ["button"],
		meta: {},
	},
];
