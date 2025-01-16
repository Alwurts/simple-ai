import type { Registry } from "./schema";

export const lib: Registry = [
	{
		name: "jsx-utils",
		description: "A function that completes a JSX string.",
		type: "registry:lib",
		files: [{ type: "registry:lib", path: "lib/jsx-utils.ts" }],
	},
];
