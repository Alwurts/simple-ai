import { BASE_URL } from "@/lib/config";
import type { Registry } from "@/shadcn-temp/schema";

export const ui: Registry["items"] = [
	{
		name: "jsx-renderer",
		description:
			"A component that renders JSX strings with access to tailwind, shadcn components and lucide icons.",
		type: "registry:ui",
		dependencies: ["react-jsx-parser", "react-error-boundary"],
		registryDependencies: [`${BASE_URL}/r/jsx-utils.json`],
		files: [{ type: "registry:ui", path: "ui/jsx-renderer.tsx" }],
	},
	{
		name: "chat-input",
		type: "registry:ui",
		dependencies: [
			"@tiptap/core",
			"@tiptap/react",
			"@tiptap/starter-kit",
			"@tiptap/extension-mention",
			"@tiptap/extension-placeholder",
			"@tiptap/suggestion",
			"tippy.js",
		],
		registryDependencies: ["input-group", "button"],
		files: [{ type: "registry:ui", path: "ui/chat-input.tsx" }],
	},
	{
		name: "message-area",
		type: "registry:ui",
		registryDependencies: ["button"],
		dependencies: ["use-stick-to-bottom"],
		files: [{ type: "registry:ui", path: "ui/message-area.tsx" }],
	},
	{
		name: "chat-message",
		type: "registry:ui",
		registryDependencies: [`${BASE_URL}/r/markdown-content.json`],
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
		name: "model-selector",
		type: "registry:ui",
		registryDependencies: ["select"],
		files: [{ type: "registry:ui", path: "ui/model-selector.tsx" }],
	},
	{
		name: "resizable-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [`${BASE_URL}/r/base-node.json`],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/resizable-node.tsx",
				target: "components/flow/resizable-node.tsx",
			},
		],
	},
	{
		name: "node-header-status",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: ["badge"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/node-header-status.tsx",
				target: "components/flow/node-header-status.tsx",
			},
		],
	},
	{
		name: "editable-handle",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"button",
			"input",
			"textarea",
			"popover",
			`${BASE_URL}/r/base-handle.json`,
		],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/editable-handle.tsx",
				target: "components/flow/editable-handle.tsx",
			},
		],
	},
	{
		name: "status-edge",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/status-edge.tsx",
				target: "components/flow/status-edge.tsx",
			},
		],
	},
	{
		name: "generate-text-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"button",
			"separator",
			`${BASE_URL}/r/model-selector.json`,
			`${BASE_URL}/r/node-header-status.json`,
			`${BASE_URL}/r/editable-handle.json`,
			`${BASE_URL}/r/labeled-handle.json`,
			`${BASE_URL}/r/base-node.json`,
			`${BASE_URL}/r/node-header.json`,
		],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/generate-text-node.tsx",
				target: "components/flow/generate-text-node.tsx",
			},
		],
	},
	{
		name: "prompt-crafter-node",
		type: "registry:ui",
		dependencies: [
			"@xyflow/react",
			"@uiw/react-codemirror",
			"@uiw/codemirror-themes",
			"@lezer/highlight",
			"@codemirror/language",
			"@codemirror/view",
		],
		registryDependencies: [
			"button",
			"separator",
			"popover",
			"command",
			`${BASE_URL}/r/node-header-status.json`,
			`${BASE_URL}/r/editable-handle.json`,
			`${BASE_URL}/r/node-header.json`,
			`${BASE_URL}/r/labeled-handle.json`,
			`${BASE_URL}/r/base-node.json`,
		],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/prompt-crafter-node.tsx",
				target: "components/flow/prompt-crafter-node.tsx",
			},
		],
	},
	{
		name: "text-input-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"textarea",
			"separator",
			`${BASE_URL}/r/labeled-handle.json`,
			`${BASE_URL}/r/node-header.json`,
			`${BASE_URL}/r/resizable-node.json`,
		],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/text-input-node.tsx",
				target: "components/flow/text-input-node.tsx",
			},
		],
	},
	{
		name: "visualize-text-node",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"separator",
			`${BASE_URL}/r/markdown-content.json`,
			`${BASE_URL}/r/labeled-handle.json`,
			`${BASE_URL}/r/node-header.json`,
			`${BASE_URL}/r/resizable-node.json`,
		],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/visualize-text-node.tsx",
				target: "components/flow/visualize-text-node.tsx",
			},
		],
	},
	// Components from reactt flow
	{
		name: "base-handle",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/base-handle.tsx",
				target: "components/flow/base-handle.tsx",
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
				target: "components/flow/labeled-handle.tsx",
			},
		],
	},
	{
		name: "base-node",
		type: "registry:ui",
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/base-node.tsx",
				target: "components/flow/base-node.tsx",
			},
		],
	},
	{
		name: "node-header",
		type: "registry:ui",
		registryDependencies: ["button", "dropdown-menu"],
		files: [
			{
				type: "registry:ui",
				path: "ui/flow/node-header.tsx",
				target: "components/flow/node-header.tsx",
			},
		],
	},
];
