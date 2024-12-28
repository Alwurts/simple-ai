import type { Registry } from "./schema";

export const ui: Registry = [
	{
		name: "chat-input",
		type: "registry:ui",
		registryDependencies: ["textarea"],
		files: [
			{ type: "registry:ui", path: "ui/chat-input.tsx" },
			{ type: "registry:hook", path: "hooks/use-textarea-resize.ts" },
		],
	},
];
