import type { Registry } from "@/registry/schema";

export const hooks: Registry = [
	{
		name: "use-textarea-resize",
		type: "registry:hook",
		files: [
			{
				path: "hooks/use-textarea-resize.ts",
				type: "registry:hook",
			},
		],
	},
];
