import type { Registry } from "@/shadcn-temp/schema";

export const hooks: Registry["items"] = [
	{
		name: "use-textarea-resize",
		type: "registry:hook",
		files: [
			{ type: "registry:hook", path: "hooks/use-textarea-resize.ts" },
		],
	},
];
