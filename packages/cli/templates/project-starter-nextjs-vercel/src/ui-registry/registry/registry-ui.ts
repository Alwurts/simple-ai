import type { RegistryItem } from "./schema";

export const ui: RegistryItem[] = [
	{
		name: "button",
		type: "registry:ui",
		title: "Button",
		description: "Displays a button or a component that looks like a button.",
		files: [
			{
				type: "registry:ui",
				path: "ui/button.tsx",
			},
		],
		registryDependencies: ["@/components/ui/button"],
	},
];
