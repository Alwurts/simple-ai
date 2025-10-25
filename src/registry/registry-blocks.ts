import type { Registry } from "@/shadcn-temp/schema";

export const blocks: Registry["items"] = [
	{
		name: "chat-01",
		description: "A simple chat page.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/react", "@ai-sdk/openai"],
		registryDependencies: [
			"card",
			"breadcrumb",
			"separator",
			"sidebar",
			"tooltip",
			"button",
			"avatar",
			"dropdown-menu",
			"@simple-ai/chat-input",
			"@simple-ai/chat-message-area",
			"@simple-ai/chat-message",
		],
		files: [
			{
				path: "blocks/chat-01/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-01/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-01/lib/config.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/chat-01/components/layout/app-layout.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-layout-skeleton.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-header.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-sidebar.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-main-nav.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-secondary-nav.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/layout/app-user-nav.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/chat/chat-main.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/chat/chat-header.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/chat-01/components/chat/chat-content.tsx",
				type: "registry:component",
			},
		],
		categories: ["chat"],
	},
	{
		name: "chat-02",
		description: "A chat in a sidebar.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai"],
		registryDependencies: [
			"sidebar",
			"breadcrumb",
			"@simple-ai/chat-input",
			"@simple-ai/chat-message-area",
			"@simple-ai/chat-message",
		],
		files: [
			{
				path: "blocks/chat-02/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-02/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-02/components/app-sidebar.tsx",
				type: "registry:component",
			},
		],
		categories: ["chat"],
	},
	{
		name: "chat-03",
		description: "A chat in a popover.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai"],
		registryDependencies: [
			"popover",
			"button",
			"@simple-ai/chat-input",
			"@simple-ai/chat-message-area",
			"@simple-ai/chat-message",
		],
		files: [
			{
				path: "blocks/chat-03/page.tsx",
				target: "app/chat/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/chat-03/route.ts",
				target: "app/api/ai/chat/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/chat-03/components/chat.tsx",
				type: "registry:component",
			},
		],
		categories: ["chat"],
	},
	{
		name: "app-01",
		description: "A app with generative UI capabilities.",
		type: "registry:block",
		dependencies: [
			"ai",
			"@ai-sdk/openai",
			"@uiw/react-codemirror",
			"@codemirror/lang-javascript",
			"zustand",
		],
		registryDependencies: [
			"avatar",
			"input",
			"label",
			"tabs",
			"resizable",
			"breadcrumb",
			"button",
			"toggle-group",
			"switch",
			"separator",
			"card",
			"badge",
			"dialog",
			"slider",
			"@simple-ai/chat-input",
			"@simple-ai/chat-message-area",
			"@simple-ai/chat-message",
			"@simple-ai/jsx-renderer",
			"@simple-ai/jsx-utils",
		],
		files: [
			{
				path: "blocks/app-01/page.tsx",
				target: "app/generative-ui/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/app-01/canvas/page.tsx",
				target: "app/canvas/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/app-01/route.ts",
				target: "app/api/ai/generate/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/app-01/hooks/generation-store.ts",
				type: "registry:hook",
			},
			{
				path: "blocks/app-01/components/versions.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/editor-layout.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/editor-toolbar.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/code-editor.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/preview.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/chat-dialog.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-01/components/copy-button.tsx",
				type: "registry:component",
			},
		],
		categories: ["app"],
	},
	{
		name: "app-02",
		description: "A persona generator app with structured outputs.",
		type: "registry:block",
		registryDependencies: [
			"dialog",
			"button",
			"input",
			"textarea",
			"label",
			"scroll-area",
			"form",
			"skeleton",
			"card",
			"avatar",
		],
		dependencies: ["ai", "@ai-sdk/openai", "zod"],
		files: [
			{
				path: "blocks/app-02/page.tsx",
				target: "app/persona/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/app-02/route.ts",
				target: "app/api/ai/persona/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/app-02/components/persona-display.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-02/lib/persona.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/app-02/lib/example-businesses.ts",
				type: "registry:lib",
			},
		],
		categories: ["app"],
	},
	{
		name: "app-03",
		description: "An X profile bio generator app.",
		type: "registry:block",
		dependencies: ["ai", "@ai-sdk/openai", "zod", "next-themes"],
		registryDependencies: [
			"button",
			"dialog",
			"input",
			"textarea",
			"form",
			"label",
			"select",
			"skeleton",
			"avatar",
		],
		files: [
			{
				path: "blocks/app-03/page.tsx",
				target: "app/x-profile/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/app-03/layout.tsx",
				target: "app/x-profile/layout.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/app-03/route.ts",
				target: "app/api/ai/x-profile/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/app-03/components/profile-generate-dialog.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-03/components/x-preview.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-03/components/toolbar.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-03/components/theme-toggle.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/app-03/lib/x.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/app-03/lib/profile-examples.ts",
				type: "registry:lib",
			},
		],
		categories: ["app"],
	},
	{
		name: "flow-chain",
		description: "Agentic chain workflow.",
		type: "registry:block",
		dependencies: [
			"@xyflow/react",
			"zustand",
			"zod",
			"ai",
			"nanoid",
			"@ai-sdk/openai",
			"@ai-sdk/groq",
			"@ai-sdk/deepseek",
		],
		registryDependencies: [
			"button",
			"card",
			"dialog",
			"input",
			"textarea",
			"sonner",
			"@simple-ai/generate-text-node",
			"@simple-ai/prompt-crafter-node",
			"@simple-ai/text-input-node",
			"@simple-ai/visualize-text-node",
		],
		files: [
			{
				path: "blocks/flow-chain/page.tsx",
				target: "app/workflow/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/flow-chain/route.ts",
				target: "app/api/workflow/execute/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/flow-chain/components/nodes-panel.tsx",
				target: "components/flow/nodes-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-chain/components/error-indicator.tsx",
				target: "components/error-indicator.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-chain/lib/news-summarization-chain.ts",
				type: "registry:lib",
			},
			{
				path: "ui/flow/status-edge-controller.tsx",
				target: "components/flow/status-edge-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/status-edge.tsx",
				target: "components/flow/status-edge.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/visualize-text-node-controller.tsx",
				target: "components/flow/visualize-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/text-input-node-controller.tsx",
				target: "components/flow/text-input-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/prompt-crafter-node-controller.tsx",
				target: "components/flow/prompt-crafter-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/generate-text-node-controller.tsx",
				target: "components/flow/generate-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "hooks/flow/use-workflow.ts",
				type: "registry:hook",
			},
			{
				path: "lib/flow/workflow.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-client.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/server-node-processors.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/node-factory.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/generate-ai-text.ts",
				type: "registry:lib",
			},
		],
		categories: ["flow"],
	},
	{
		name: "flow-routing",
		description: "Agentic routing workflow.",
		type: "registry:block",
		dependencies: [
			"@xyflow/react",
			"zustand",
			"zod",
			"ai",
			"nanoid",
			"@ai-sdk/openai",
			"@ai-sdk/groq",
			"@ai-sdk/deepseek",
		],
		registryDependencies: [
			"button",
			"card",
			"dialog",
			"input",
			"textarea",
			"sonner",
			"@simple-ai/generate-text-node",
			"@simple-ai/prompt-crafter-node",
			"@simple-ai/text-input-node",
			"@simple-ai/visualize-text-node",
		],
		files: [
			{
				path: "blocks/flow-routing/page.tsx",
				target: "app/workflow/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/flow-routing/route.ts",
				target: "app/api/workflow/execute/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/flow-routing/components/nodes-panel.tsx",
				target: "components/flow/nodes-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-chain/components/error-indicator.tsx",
				target: "components/error-indicator.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-routing/lib/content-creator-routing.ts",
				type: "registry:lib",
			},
			{
				path: "ui/flow/status-edge-controller.tsx",
				target: "components/flow/status-edge-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/status-edge.tsx",
				target: "components/flow/status-edge.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/visualize-text-node-controller.tsx",
				target: "components/flow/visualize-text-node-controller.tsx",
				type: "registry:component",
			},

			{
				path: "ui/flow/text-input-node-controller.tsx",
				target: "components/flow/text-input-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/prompt-crafter-node-controller.tsx",
				target: "components/flow/prompt-crafter-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/generate-text-node-controller.tsx",
				target: "components/flow/generate-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "hooks/flow/use-workflow.ts",
				type: "registry:hook",
			},
			{
				path: "lib/flow/workflow.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-client.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/server-node-processors.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/node-factory.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/generate-ai-text.ts",
				type: "registry:lib",
			},
		],
		categories: ["flow"],
	},
	{
		name: "flow-parallelization",
		description: "Agentic parallelization workflow.",
		type: "registry:block",
		dependencies: [
			"@xyflow/react",
			"zustand",
			"zod",
			"ai",
			"nanoid",
			"@ai-sdk/openai",
			"@ai-sdk/groq",
			"@ai-sdk/deepseek",
		],
		registryDependencies: [
			"button",
			"card",
			"dialog",
			"input",
			"textarea",
			"sonner",
			"@simple-ai/generate-text-node",
			"@simple-ai/prompt-crafter-node",
			"@simple-ai/text-input-node",
			"@simple-ai/visualize-text-node",
		],
		files: [
			{
				path: "blocks/flow-parallelization/page.tsx",
				target: "app/workflow/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/flow-parallelization/route.ts",
				target: "app/api/workflow/execute/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/flow-parallelization/components/nodes-panel.tsx",
				target: "components/flow/nodes-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-parallelization/components/error-indicator.tsx",
				target: "components/error-indicator.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-parallelization/lib/exam-creator-parallelization.ts",
				type: "registry:lib",
			},
			{
				path: "ui/flow/status-edge-controller.tsx",
				target: "components/flow/status-edge-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/status-edge.tsx",
				target: "components/flow/status-edge.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/visualize-text-node-controller.tsx",
				target: "components/flow/visualize-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/text-input-node-controller.tsx",
				target: "components/flow/text-input-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/prompt-crafter-node-controller.tsx",
				target: "components/flow/prompt-crafter-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/generate-text-node-controller.tsx",
				target: "components/flow/generate-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "hooks/flow/use-workflow.ts",
				type: "registry:hook",
			},
			{
				path: "lib/flow/workflow.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-client.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/server-node-processors.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/node-factory.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/generate-ai-text.ts",
				type: "registry:lib",
			},
		],
		categories: ["flow"],
	},
	{
		name: "flow-orchestrator",
		description: "Agentic orchestrator workflow.",
		type: "registry:block",
		dependencies: [
			"@xyflow/react",
			"zustand",
			"zod",
			"ai",
			"nanoid",
			"@ai-sdk/openai",
			"@ai-sdk/groq",
			"@ai-sdk/deepseek",
		],
		registryDependencies: [
			"button",
			"card",
			"dialog",
			"input",
			"textarea",
			"sonner",
			"@simple-ai/generate-text-node",
			"@simple-ai/prompt-crafter-node",
			"@simple-ai/text-input-node",
			"@simple-ai/visualize-text-node",
		],
		files: [
			{
				path: "blocks/flow-orchestrator/page.tsx",
				target: "app/workflow/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/flow-orchestrator/route.ts",
				target: "app/api/workflow/execute/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/flow-orchestrator/components/nodes-panel.tsx",
				target: "components/flow/nodes-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-orchestrator/components/error-indicator.tsx",
				target: "components/error-indicator.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/flow-orchestrator/lib/developer-tasks-orchestrator.ts",
				type: "registry:lib",
			},
			{
				path: "ui/flow/status-edge-controller.tsx",
				target: "components/flow/status-edge-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/status-edge.tsx",
				target: "components/flow/status-edge.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/visualize-text-node-controller.tsx",
				target: "components/flow/visualize-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/text-input-node-controller.tsx",
				target: "components/flow/text-input-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/prompt-crafter-node-controller.tsx",
				target: "components/flow/prompt-crafter-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "ui/flow/generate-text-node-controller.tsx",
				target: "components/flow/generate-text-node-controller.tsx",
				type: "registry:component",
			},
			{
				path: "hooks/flow/use-workflow.ts",
				type: "registry:hook",
			},
			{
				path: "lib/flow/workflow.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-client.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/sse-workflow-execution-engine.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/server-node-processors.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/node-factory.ts",
				type: "registry:lib",
			},
			{
				path: "lib/flow/generate-ai-text.ts",
				type: "registry:lib",
			},
		],
		categories: ["flow"],
	},
];
