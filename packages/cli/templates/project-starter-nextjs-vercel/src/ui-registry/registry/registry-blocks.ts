import type { RegistryItem } from "./schema";

export const blocks: RegistryItem[] = [
	{
		name: "app-01",
		type: "registry:block",
		title: "App 01",
		description: "An example app layout with a sidebar and a main content area.",
		registryDependencies: ["button"],
		files: [
			{
				type: "registry:block",
				path: "blocks/app-01/page.tsx",
			},
			{
				type: "registry:block",
				path: "blocks/app-01/components/app-sidebar.tsx",
			},
		],
	},
];
