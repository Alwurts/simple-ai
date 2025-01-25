import type { Model } from "@/registry/blocks/flow-01/types/ai";
import type {
	EdgeExecutionState,
	NodeExecutionState,
} from "@/registry/blocks/flow-01/types/execution";
import type { Edge, Node } from "@xyflow/react";

// Dynamic Handles

export type DynamicHandle = {
	id: string;
	name: string;
	description?: string;
	//type: THandleType;
};

type DynamicHandles<THandleCategory extends string> = {
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

type BaseNodeData = {
	executionState?: NodeExecutionState;
};

type VisualizeTextData = BaseNodeData;

export type VisualizeTextNode = Node<VisualizeTextData, "visualize-text"> & {
	type: "visualize-text";
};

// Text Input

type TextInputConfig = {
	value: string;
};

type TextInputData = BaseNodeData & {
	config: TextInputConfig;
};

export type TextInputNode = Node<TextInputData, "text-input"> & {
	type: "text-input";
};

// Prompt Crafter

type PromptCrafterConfig = {
	template: string;
};

type PromptCrafterData = BaseNodeData & {
	config: PromptCrafterConfig;
	dynamicHandles: DynamicHandles<"template-tags">;
};

export type PromptCrafterNode = Node<PromptCrafterData, "prompt-crafter"> & {
	type: "prompt-crafter";
};

// Generate Text

type GenerateTextConfig = {
	model: Model;
};

type GenerateTextData = BaseNodeData & {
	config: GenerateTextConfig;
	dynamicHandles: DynamicHandles<"tools">;
};

export type GenerateTextNode = Node<GenerateTextData, "generate-text"> & {
	type: "generate-text";
};

// Flow

export type FlowNodeDataTypeMap = {
	"visualize-text": VisualizeTextData;
	"text-input": TextInputData;
	"prompt-crafter": PromptCrafterData;
	"generate-text": GenerateTextData;
};

export type FlowNode =
	| VisualizeTextNode
	| TextInputNode
	| PromptCrafterNode
	| GenerateTextNode;

// Edges

type FlowEdgeData = {
	executionState?: EdgeExecutionState;
};

export type CustomFlowEdge = Edge<FlowEdgeData, "custom-edge"> & {
	type: "custom-edge";
};

export type FlowEdge = CustomFlowEdge & {
	sourceHandle: string;
	targetHandle: string;
};

// Type Guards

export function hasTargets(
	node: FlowNode,
): node is Extract<
	FlowNode,
	VisualizeTextNode | PromptCrafterNode | GenerateTextNode
> {
	switch (node.type) {
		case "visualize-text":
		case "prompt-crafter":
		case "generate-text":
			return true;
		default:
			return false;
	}
}

export function hasSources(
	node: FlowNode,
): node is Extract<
	FlowNode,
	TextInputNode | PromptCrafterNode | GenerateTextNode
> {
	switch (node.type) {
		case "text-input":
		case "prompt-crafter":
		case "generate-text":
			return true;
		default:
			return false;
	}
}

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
