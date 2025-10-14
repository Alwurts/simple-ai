import type { Registry } from "@/shadcn-temp/schema";

export const lib: Registry["items"] = [
	{
		name: "jsx-utils",
		description: "A set of utilities for working with JSX.",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/jsx-utils.ts" }],
	},
];
