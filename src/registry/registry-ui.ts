import type { Registry } from "./schema";

export const ui: Registry = [
	{
		name: "chat-input",
		type: "registry:ui",
		registryDependencies: ["textarea", "use-textarea-resize"],
		files: [{ type: "registry:ui", path: "ui/chat-input.tsx" }],
	},
];
