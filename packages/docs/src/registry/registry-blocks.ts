import type { Registry } from "@/shadcn-temp/schema";

// Global docs and envVars constants
const DEFAULT_OPENAI_DOCS =
	"Get an OpenAI API key from https://platform.openai.com/ and add it to the environment variables file and run the dev server. \n\nLearn more about how to use the Vercel AI SDK https://ai-sdk.dev/docs/introduction.";

const DEFAULT_OPENAI_ENV_VARS = {
	OPENAI_API_KEY: "",
};

const DEFAULT_MULTI_PROVIDER_DOCS =
	"Get API keys from OpenAI (https://platform.openai.com/), Groq (https://console.groq.com/), and DeepSeek (https://platform.deepseek.com/) and add them to the environment variables file and run the dev server. \n\nLearn more about how to use the Vercel AI SDK https://ai-sdk.dev/docs/introduction.";

const DEFAULT_MULTI_PROVIDER_ENV_VARS = {
	OPENAI_API_KEY: "",
	GROQ_API_KEY: "",
	DEEPSEEK_API_KEY: "",
};

export const blocks: Registry["items"] = [
	{
		name: "chat-01",
		description: "A simple chat page.",
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
		dependencies: ["ai", "@ai-sdk/react", "@ai-sdk/openai"],
		registryDependencies: [
			"card",
			"badge",
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
			"@simple-ai/tool-invocation",
			"@simple-ai/chat-suggestions",
			"@simple-ai/reasoning",
			"@simple-ai/agents",
			"@simple-ai/messages",
			"@simple-ai/models",
			"@simple-ai/tools",
			"@simple-ai/agent-respond",
			"@simple-ai/ai-utils",
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
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
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
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
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
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
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
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
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
		docs: DEFAULT_OPENAI_DOCS,
		type: "registry:block",
		envVars: DEFAULT_OPENAI_ENV_VARS,
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
		docs: DEFAULT_MULTI_PROVIDER_DOCS,
		type: "registry:block",
		envVars: DEFAULT_MULTI_PROVIDER_ENV_VARS,
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
		docs: DEFAULT_MULTI_PROVIDER_DOCS,
		type: "registry:block",
		envVars: DEFAULT_MULTI_PROVIDER_ENV_VARS,
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
		docs: DEFAULT_MULTI_PROVIDER_DOCS,
		type: "registry:block",
		envVars: DEFAULT_MULTI_PROVIDER_ENV_VARS,
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
		docs: DEFAULT_MULTI_PROVIDER_DOCS,
		type: "registry:block",
		envVars: DEFAULT_MULTI_PROVIDER_ENV_VARS,
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
	{
		name: "workflow-01",
		description:
			"Build powerful AI agent workflows with React Flow components integrated with Vercel AI SDK.",
		type: "registry:block",
		docs: DEFAULT_OPENAI_DOCS,
		envVars: DEFAULT_OPENAI_ENV_VARS,
		dependencies: [
			"@xyflow/react",
			"zustand",
			"zod",
			"ai",
			"@ai-sdk/react",
			"@ai-sdk/openai",
			"nanoid",
			"@marcbachmann/cel-js",
			"@uiw/react-codemirror",
			"@codemirror/language",
			"@lezer/highlight",
			"lucide-react",
			"next-themes",
		],
		registryDependencies: [
			"button",
			"card",
			"dialog",
			"input",
			"textarea",
			"sonner",
			"sidebar",
			"badge",
			"checkbox",
			"collapsible",
			"dropdown-menu",
			"popover",
			"select",
			"switch",
			"tooltip",
			"separator",
			"@simple-ai/chat-input",
			"@simple-ai/chat-message-area",
			"@simple-ai/chat-message",
			"@simple-ai/tool-invocation",
			"@simple-ai/chat-suggestions",
			"@simple-ai/reasoning",
			"@simple-ai/json-schema-editor",
		],
		files: [
			{
				path: "blocks/workflow-01/page.tsx",
				target: "app/workflow/page.tsx",
				type: "registry:page",
			},
			{
				path: "blocks/workflow-01/route.ts",
				target: "app/api/workflow/route.ts",
				type: "registry:page",
			},
			{
				path: "blocks/workflow-01/components/app-header.tsx",
				target: "components/app-header.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/app-layout.tsx",
				target: "components/app-layout.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/chat.tsx",
				target: "components/chat.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/editor/condition-editor.tsx",
				target: "components/editor/condition-editor.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/editor/condition-editor.css",
				target: "components/editor/condition-editor.css",
				type: "registry:style",
			},
			{
				path: "blocks/workflow-01/components/node-editor-panel.tsx",
				target: "components/node-editor-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/node-execution.tsx",
				target: "components/node-execution.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/node-selector-panel.tsx",
				target: "components/node-selector-panel.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/template-selector.tsx",
				target: "components/template-selector.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/theme-provider.tsx",
				target: "components/theme-provider.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/theme-toggle.tsx",
				target: "components/theme-toggle.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/validation-status.tsx",
				target: "components/validation-status.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/index.ts",
				target: "lib/workflow/nodes/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/agent/agent.shared.ts",
				target: "lib/workflow/nodes/agent/agent.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/agent/agent.client.tsx",
				target: "lib/workflow/nodes/agent/agent.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/agent/agent.server.ts",
				target: "lib/workflow/nodes/agent/agent.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/agent/index.ts",
				target: "lib/workflow/nodes/agent/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/if-else/if-else.shared.ts",
				target: "lib/workflow/nodes/if-else/if-else.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/if-else/if-else.client.tsx",
				target: "lib/workflow/nodes/if-else/if-else.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/if-else/if-else.server.ts",
				target: "lib/workflow/nodes/if-else/if-else.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/if-else/index.ts",
				target: "lib/workflow/nodes/if-else/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/start/start.shared.ts",
				target: "lib/workflow/nodes/start/start.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/start/start.client.tsx",
				target: "lib/workflow/nodes/start/start.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/start/start.server.ts",
				target: "lib/workflow/nodes/start/start.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/start/index.ts",
				target: "lib/workflow/nodes/start/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/end/end.shared.ts",
				target: "lib/workflow/nodes/end/end.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/end/end.client.tsx",
				target: "lib/workflow/nodes/end/end.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/end/end.server.ts",
				target: "lib/workflow/nodes/end/end.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/end/index.ts",
				target: "lib/workflow/nodes/end/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/note/note.shared.ts",
				target: "lib/workflow/nodes/note/note.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/note/note.client.tsx",
				target: "lib/workflow/nodes/note/note.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/note/note.server.ts",
				target: "lib/workflow/nodes/note/note.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/note/index.ts",
				target: "lib/workflow/nodes/note/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/wait/wait.shared.ts",
				target: "lib/workflow/nodes/wait/wait.shared.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/wait/wait.client.tsx",
				target: "lib/workflow/nodes/wait/wait.client.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/wait/wait.server.ts",
				target: "lib/workflow/nodes/wait/wait.server.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/nodes/wait/index.ts",
				target: "lib/workflow/nodes/wait/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/components/workflow/primitives/base-handle.tsx",
				target: "components/workflow/primitives/base-handle.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/workflow/primitives/base-node.tsx",
				target: "components/workflow/primitives/base-node.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/workflow/primitives/labeled-handle.tsx",
				target: "components/workflow/primitives/labeled-handle.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/workflow/primitives/node-header.tsx",
				target: "components/workflow/primitives/node-header.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/workflow/primitives/resizable-node.tsx",
				target: "components/workflow/primitives/resizable-node.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/workflow/status-edge.tsx",
				target: "components/workflow/status-edge.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/components/model-selector.tsx",
				target: "components/model-selector.tsx",
				type: "registry:component",
			},
			{
				path: "blocks/workflow-01/lib/templates/index.ts",
				target: "lib/templates/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/templates/code-analysis-workflow.ts",
				target: "lib/templates/code-analysis-workflow.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/templates/wikipedia-research-workflow.ts",
				target: "lib/templates/wikipedia-research-workflow.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/templates/wait-demo-workflow.ts",
				target: "lib/templates/wait-demo-workflow.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/templates/customer-support-workflow.ts",
				target: "lib/templates/customer-support-workflow.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/tools/index.ts",
				target: "lib/tools/index.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/tools/wikipedia-query.ts",
				target: "lib/tools/wikipedia-query.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/executor.ts",
				target: "lib/workflow/executor.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/models-external.ts",
				target: "lib/workflow/models.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/types/messages.ts",
				target: "types/messages.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/types/workflow.ts",
				target: "types/workflow.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/validation.ts",
				target: "lib/workflow/validation.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/context/schema-introspection.ts",
				target: "lib/workflow/context/schema-introspection.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/lib/workflow/context/variable-resolver.ts",
				target: "lib/workflow/context/variable-resolver.ts",
				type: "registry:lib",
			},
			{
				path: "blocks/workflow-01/hooks/use-workflow.ts",
				target: "hooks/workflow/use-workflow.ts",
				type: "registry:hook",
			},
		],

		categories: ["workflow"],
	},
];
