import type { Registry } from "@/shadcn-temp/schema";

export const ui: Registry["items"] = [
	{
		name: "jsx-renderer",
		title: "JSX Renderer",
		description:
			"A component that renders JSX strings with access to tailwind, shadcn components and lucide icons.",
		type: "registry:ui",
		dependencies: ["react-jsx-parser", "react-error-boundary"],
		registryDependencies: ["@simple-ai/jsx-utils"],
		files: [{ type: "registry:ui", path: "ui/jsx-renderer.tsx" }],
	},
	{
		name: "chat-input",
		title: "Chat Input",
		description:
			"A chat input component with mention support and automatic height adjustment.",
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
		name: "chat-message-area",
		title: "Chat Message Area",
		description:
			"A component that adds auto scrolling functionality to a list of messages.",
		type: "registry:ui",
		registryDependencies: ["button"],
		dependencies: ["use-stick-to-bottom"],
		files: [{ type: "registry:ui", path: "ui/chat-message-area.tsx" }],
	},
	{
		name: "chat-message",
		title: "Chat Message",
		description:
			"A fully composable component for displaying chat messages with rich features like timestamps, actions, and threading.",
		type: "registry:ui",
		registryDependencies: [
			"@simple-ai/markdown-content",
			"avatar",
			"button",
			"card",
			"tooltip",
		],
		files: [{ type: "registry:ui", path: "ui/chat-message.tsx" }],
	},
	{
		name: "chat-suggestions",
		title: "Chat Suggestions",
		description:
			"A composable component for displaying chat prompt suggestions as clickable buttons.",
		type: "registry:ui",
		registryDependencies: ["button"],
		files: [{ type: "registry:ui", path: "ui/chat-suggestions.tsx" }],
	},
	{
		name: "markdown-content",
		title: "Markdown Content",
		description: "A component that renders markdown content.",
		type: "registry:ui",
		dependencies: [
			"react-markdown",
			"marked",
			"shiki",
			"remark-gfm",
			"rehype-raw",
		],
		files: [{ type: "registry:ui", path: "ui/markdown-content.tsx" }],
	},
	{
		name: "tool-invocation",
		title: "Tool Invocation",
		description:
			"A component that displays a tool invocation with a collapsible content.",
		type: "registry:ui",
		registryDependencies: ["card", "collapsible"],
		files: [
			{ type: "registry:ui", path: "ui/tool-invocation.tsx" },
			{ type: "registry:lib", path: "lib/id-to-readable-text.ts" },
		],
	},
	{
		name: "model-selector",
		title: "Model Selector",
		description:
			"A dropdown component for selecting AI models with provider icons.",
		type: "registry:ui",
		registryDependencies: ["select"],
		files: [{ type: "registry:ui", path: "ui/model-selector.tsx" }],
	},
	{
		name: "resizable-node",
		title: "Resizable Node",
		description:
			"A wrapper React Flow node component that adds resizing functionality to other nodes.",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: ["@simple-ai/base-node"],
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
		title: "Node Header Status",
		description:
			"A React Flow component that displays status indicators in node headers.",
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
		title: "Editable Handle",
		description:
			"A React Flow component that allows you to dynamically add, edit, or remove input/output handles on your nodes.",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"button",
			"input",
			"textarea",
			"popover",
			"@simple-ai/base-handle",
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
		title: "Status Edge",
		description:
			"A React Flow edge component that provides visual feedback through color-coded states.",
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
		title: "Generate Text Node",
		description:
			"A React Flow node component that represents Vercel AI SDK's text generation capabilities, featuring system instructions, prompts, and optional tool outputs.",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"button",
			"separator",
			"@simple-ai/model-selector",
			"@simple-ai/node-header-status",
			"@simple-ai/editable-handle",
			"@simple-ai/labeled-handle",
			"@simple-ai/base-node",
			"@simple-ai/node-header",
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
		title: "Prompt Crafter Node",
		description:
			"A React Flow node component for building dynamic prompts by combining multiple inputs using a template-based approach.",
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
			"@simple-ai/node-header-status",
			"@simple-ai/editable-handle",
			"@simple-ai/node-header",
			"@simple-ai/labeled-handle",
			"@simple-ai/base-node",
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
		title: "Text Input Node",
		description:
			"A React Flow node component that provides a simple text input interface with a resizable textarea and single output.",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"textarea",
			"separator",
			"@simple-ai/labeled-handle",
			"@simple-ai/node-header",
			"@simple-ai/resizable-node",
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
		title: "Visualize Text Node",
		description:
			"A React Flow node component for displaying text content with Markdown support and a resizable interface.",
		type: "registry:ui",
		dependencies: ["@xyflow/react"],
		registryDependencies: [
			"separator",
			"@simple-ai/markdown-content",
			"@simple-ai/labeled-handle",
			"@simple-ai/node-header",
			"@simple-ai/resizable-node",
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
	{
		name: "json-schema-editor",
		title: "JSON Schema Editor",
		description:
			"A visual editor for creating and editing JSON Schema definitions with support for nested objects, arrays, enums, and property descriptions.",
		type: "registry:ui",
		dependencies: ["nanoid"],
		registryDependencies: ["button", "dialog", "input", "select"],
		files: [{ type: "registry:ui", path: "ui/json-schema-editor.tsx" }],
	},
	{
		name: "json-schema-viewer",
		title: "JSON Schema Viewer",
		description:
			"A read-only component for displaying JSON Schema structures with support for union types, nested objects, arrays, and enums.",
		type: "registry:ui",
		files: [{ type: "registry:ui", path: "ui/json-schema-viewer.tsx" }],
	},
	{
		name: "reasoning",
		title: "Reasoning",
		description:
			"A component for displaying AI reasoning content with collapsible sections and streaming support.",
		type: "registry:ui",
		dependencies: ["ai"],
		registryDependencies: ["collapsible", "@simple-ai/markdown-content"],
		files: [{ type: "registry:ui", path: "ui/reasoning.tsx" }],
	},
];
