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
	{
		name: "jsx-renderer",
		description:
			"A component that renders JSX strings with access to tailwind, shadcn components and lucide icons.",
		type: "registry:ui",
		dependencies: ["react-jsx-parser"],
		files: [{ type: "registry:ui", path: "ui/jsx-renderer.tsx" }],
	},
	{
		name: "model-selector",
		type: "registry:ui",
		registryDependencies: ["select"],
		files: [{ type: "registry:ui", path: "ui/model-selector.tsx" }],
	},
];
