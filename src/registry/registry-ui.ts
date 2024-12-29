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
	{
		name: "chat-message",
		type: "registry:ui",
		registryDependencies: ["https://ai.alwurts.com/registry/markdown-content.json"],
		files: [{ type: "registry:ui", path: "ui/chat-message.tsx" }],
	},
	{
		name: "markdown-content",
		type: "registry:ui",
		dependencies: ["react-markdown", "marked"],
		files: [{ type: "registry:ui", path: "ui/markdown-content.tsx" }],
	},
];
