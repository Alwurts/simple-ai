import type { Registry } from "./schema";

export const lib: Registry = [
	{
		name: "jsx-utils",
		description: "A set of utilities for working with JSX.",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/jsx-utils.ts" }],
	},
];
