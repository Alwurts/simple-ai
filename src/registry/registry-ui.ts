import type { Registry } from "@/shadcn-temp/schema";

export const ui: Registry["items"] = [
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
		registryDependencies: [],
		files: [{ type: "registry:ui", path: "ui/chat-message.tsx" }],
	},
	{
		name: "chat-message-area",
		type: "registry:ui",
		registryDependencies: ["scroll-area"],
		files: [
			{ type: "registry:ui", path: "ui/chat-message-area.tsx" },
			{ type: "registry:hook", path: "hooks/use-scroll-to-bottom.ts" },
		],
	},
	{
		name: "markdown-content",
		type: "registry:ui",
		registryDependencies: [],
		files: [{ type: "registry:ui", path: "ui/markdown-content.tsx" }],
	},
];
