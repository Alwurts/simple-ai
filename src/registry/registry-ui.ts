import type { Registry } from "./schema";

export const ui: Registry = [
	{
		name: "jsx-renderer",
		description:
			"A component that renders JSX strings with access to tailwind, shadcn components and lucide icons.",
		type: "registry:ui",
		dependencies: ["react-jsx-parser"],
		registryDependencies: ["https://simple-ai.dev/r/jsx-utils.json"],
		files: [{ type: "registry:ui", path: "ui/jsx-renderer.tsx" }],
	},
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
		name: "chat-message-area",
		type: "registry:ui",
		registryDependencies: ["scroll-area", "button"],
		files: [
			{ type: "registry:ui", path: "ui/chat-message-area.tsx" },
			{ type: "registry:hook", path: "hooks/use-scroll-to-bottom.ts" },
		],
	},
	{
		name: "chat-message",
		type: "registry:ui",
		registryDependencies: ["https://simple-ai.dev/r/markdown-content.json"],
		files: [{ type: "registry:ui", path: "ui/chat-message.tsx" }],
	},
	{
		name: "markdown-content",
		description: "A markdown content component.",
		type: "registry:ui",
		dependencies: ["react-markdown", "marked", "remark-gfm", "shiki"],
		files: [{ type: "registry:ui", path: "ui/markdown-content.tsx" }],
	},
	{
		name: "base-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/base-node.tsx",
				target: "components/ui/flow/base-node.tsx",
			},
		],
	},
	{
		name: "resizable-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: ["https://simple-ai.dev/r/base-node.json"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/resizable-node.tsx",
				target: "components/ui/flow/resizable-node.tsx",
			},
		],
	},
	{
		name: "node-header",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: ["button", "dropdown-menu", "badge"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/node-header.tsx",
				target: "components/ui/flow/node-header.tsx",
			},
		],
	},
	{
		name: "base-handle",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/base-handle.tsx",
				target: "components/ui/flow/base-handle.tsx",
			},
		],
	},
	{
		name: "labeled-handle",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/labeled-handle.tsx",
				target: "components/ui/flow/labeled-handle.tsx",
			},
		],
	},
	{
		name: "editable-handle",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: ["button", "input", "textarea", "popover", "toast"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/editable-handle.tsx",
				target: "components/ui/flow/editable-handle.tsx",
			},
		],
	},
	{
		name: "connection",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/connection.tsx",
				target: "components/ui/flow/connection.tsx",
			},
		],
	},
];
