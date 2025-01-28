import type {
	EdgeExecutionState,
	NodeExecutionState,
} from "@/registry/lib/flow/workflow-execution-engine";
import type { ConnectionEdge } from "@/registry/ui/flow/connection";
import type { GenerateTextNode } from "@/registry/ui/flow/generate-text-node";
import type { PromptCrafterNode } from "@/registry/ui/flow/prompt-crafter-node";
import type { TextInputNode } from "@/registry/ui/flow/text-input-node";
import type { VisualizeTextNode } from "@/registry/ui/flow/visualize-text-node";

// Dynamic Handles

export type DynamicHandle = {
	id: string;
	name: string;
	description?: string;
};

export type DynamicHandles<THandleCategory extends string> = {
	[key in THandleCategory]: DynamicHandle[];
};

// Visualize Text

/* export const VISUALIZE_TEXT_TARGETS = ["input"] as const;
type VisualizeTextTargets = (typeof VISUALIZE_TEXT_TARGETS)[number]; */

// Node Configuration
export type NodeHandleRequirements = {
	required: string[];
	optional: string[];
};

export type NodeTypeConfig = {
	targets?: NodeHandleRequirements;
	sources?: NodeHandleRequirements;
};

export const NODE_TYPE_CONFIG: Record<FlowNode["type"], NodeTypeConfig> = {
	"generate-text": {
		targets: {
			required: ["prompt"],
			optional: ["system"],
		},
		sources: {
			required: [],
			optional: ["result"],
		},
	},
	"visualize-text": {
		targets: {
			required: [],
			optional: ["input"],
		},
	},
	"text-input": {
		sources: {
			required: [],
			optional: ["result"],
		},
	},
	"prompt-crafter": {
		targets: {
			required: [],
			optional: [], // template-tags are dynamic
		},
		sources: {
			required: [],
			optional: ["result"],
		},
	},
};

export type BaseNodeData = {
	executionState?: NodeExecutionState;
};

// Flow

export type FlowNodeDataTypeMap = {
	"visualize-text": VisualizeTextNode["data"];
	"text-input": TextInputNode["data"];
	"prompt-crafter": PromptCrafterNode["data"];
	"generate-text": GenerateTextNode["data"];
};

export type FlowNode =
	| VisualizeTextNode
	| TextInputNode
	| PromptCrafterNode
	| GenerateTextNode;

// Edges

export type BaseFlowEdgeData = {
	executionState?: EdgeExecutionState;
};

export type FlowEdge = ConnectionEdge;

// Type Guards

export function isNodeOfType<T extends FlowNode["type"]>(
	node: FlowNode,
	type: T,
): node is Extract<FlowNode, { type: T }> {
	return node.type === type;
}

export function isNodeWithDynamicHandles<T extends FlowNode>(
	node: T,
): node is Extract<T, { data: { dynamicHandles: DynamicHandles<string> } }> {
	return "dynamicHandles" in node.data;
}
