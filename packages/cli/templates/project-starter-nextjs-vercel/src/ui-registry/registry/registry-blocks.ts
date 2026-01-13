import type { RegistryItem } from "./schema";

export const blocks: RegistryItem[] = [
	{
		name: "button-showcase",
		type: "registry:block",
		title: "Button Showcase",
		description: "A comprehensive showcase of button variants, sizes, and states.",
		files: [
			{
				type: "registry:block",
				path: "blocks/button-showcase.tsx",
			},
		],
		registryDependencies: ["@/components/ui/button"],
		meta: {
			container: "p-8",
		},
	},
];
