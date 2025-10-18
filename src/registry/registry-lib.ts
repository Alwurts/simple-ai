import type { Registry } from "@/shadcn-temp/schema";

export const lib: Registry["items"] = [
	{
		name: "jsx-utils",
		description: "A set of utilities for working with JSX.",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/jsx-utils.ts" }],
	},
	{
		name: "id-to-readable-text",
		description: "A utility for converting an ID to a readable text.",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/id-to-readable-text.ts" }],
	},
];
