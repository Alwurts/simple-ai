import type { Registry } from "@/shadcn-temp/schema";

export const lib: Registry["items"] = [
	{
		name: "jsx-utils",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/jsx-utils.ts" }],
	},
];
