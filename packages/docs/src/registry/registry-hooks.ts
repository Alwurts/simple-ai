import type { Registry } from "@/shadcn-temp/schema";

export const hooks: Registry["items"] = [
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
