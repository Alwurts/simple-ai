import type { NodeProps } from "@xyflow/react";
import type { JSONSchema7, ModelMessage, UIMessageStreamWriter } from "ai";
import type { z } from "zod";
import type { StatusEdge } from "@/registry/blocks/workflow-01/components/workflow/status-edge";
import type { nodeRegistry } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/types/messages";

// ========== NODES ==========

export type TextNodeOutput = {
	type: "text";
};

export type StructuredNodeOutput = {
	type: "structured";
	schema: JSONSchema7;
};

export type NodeOutput = TextNodeOutput | StructuredNodeOutput;

export const NODE_STATUSES = [
	"processing",
	"error",
	"success",
	"idle",
] as const;

export type NodeStatus = (typeof NODE_STATUSES)[number];

type NodeMap = {
	[K in keyof typeof nodeRegistry]: ReturnType<
		(typeof nodeRegistry)[K]["client"]["create"]
	>;
};

export type FlowNode = NodeMap[keyof NodeMap];
export type FlowNodeType = FlowNode["type"];

export type AnyNodeDefinition =
	(typeof nodeRegistry)[keyof typeof nodeRegistry];

export function isNodeOfType<T extends FlowNode["type"]>(
	node: FlowNode,
	type: T,
): node is Extract<FlowNode, { type: T }> {
	return node.type === type;
}

export interface NodeSharedDefinition<TNode extends FlowNode> {
	type: TNode["type"];
	// biome-ignore lint/suspicious/noExplicitAny: Zod schema types are complex and vary by node
	dataSchema: z.ZodObject<any, any>;
	validate: (node: TNode, context: ValidationContext) => ValidationError[];
}

export interface NodeClientDefinition<TNode extends FlowNode> {
	component: React.ComponentType<NodeProps<TNode>>;
	// biome-ignore lint/suspicious/noExplicitAny: Panel components may accept additional props
	panelComponent: React.ComponentType<any>;
	create: (position: { x: number; y: number }) => TNode;
	meta: {
		label: string;
		icon: React.ComponentType<{ className?: string }>;
		description: string;
	};
}

export interface NodeServerDefinition<TNode extends FlowNode> {
	execute: (
		context: ExecutionContext<TNode>,
	) => Promise<NodeExecutionResult> | NodeExecutionResult;
}

export interface NodeDefinition<TNode extends FlowNode> {
	shared: NodeSharedDefinition<TNode>;
	client: NodeClientDefinition<TNode>;
	server: NodeServerDefinition<TNode>;
}

// ========== EDGES ==========

export type FlowEdge = StatusEdge;

// ========== VALIDATION TYPES ==========

export type ValidationSeverity = "error" | "warning";

type NodeHandleErrorInfo = {
	id: string;
	handleId: string;
};

type EdgeErrorInfo = {
	id: string;
	source: string;
	target: string;
	sourceHandle: string;
	targetHandle: string;
};

export type MultipleSourcesError = {
	severity: "error";
	message: string;
	type: "multiple-sources-for-target-handle";
	edges: EdgeErrorInfo[];
};

export type MultipleOutgoingError = {
	severity: "error";
	message: string;
	type: "multiple-outgoing-from-source-handle";
	edges: EdgeErrorInfo[];
};

export type CycleError = {
	severity: "error";
	message: string;
	type: "cycle";
	edges: EdgeErrorInfo[];
};

export type MissingConnectionError = {
	severity: "error";
	message: string;
	type: "missing-required-connection";
	node: NodeHandleErrorInfo;
};

type NodeErrorInfo = {
	id: string;
};

type ConditionErrorInfo = {
	nodeId: string;
	handleId: string;
	condition: string;
	error: string;
};

export type InvalidConditionError = {
	severity: "error";
	message: string;
	type: "invalid-condition";
	condition: ConditionErrorInfo;
};

export type NoStartNodeError = {
	severity: "error";
	message: string;
	type: "no-start-node";
	count: number;
};

export type NoEndNodeError = {
	severity: "error";
	message: string;
	type: "no-end-node";
};

export type UnreachableNodeError = {
	severity: "warning";
	message: string;
	type: "unreachable-node";
	nodes: NodeErrorInfo[];
};

export type InvalidNodeConfigError = {
	severity: ValidationSeverity;
	message: string;
	type: "invalid-node-config";
	node: NodeErrorInfo;
};

export type ValidationError =
	| CycleError
	| MultipleSourcesError
	| MultipleOutgoingError
	| MissingConnectionError
	| InvalidConditionError
	| NoStartNodeError
	| NoEndNodeError
	| UnreachableNodeError
	| InvalidNodeConfigError;

// ========== EXECUTION TYPES ==========

export type ExecutionResult = {
	text: string;
	structured?: unknown;
	nodeType: FlowNode["type"];
	messages?: ModelMessage[];
};

export interface NodeExecutionResult {
	result: {
		text: string;
		structured?: unknown;
	};
	nextNodeId: string | null;
}

export interface ExecutionContext<TNode extends FlowNode> {
	node: TNode;
	nodes: FlowNode[];
	edges: FlowEdge[];
	executionMemory: Record<string, ExecutionResult>;
	accumulatedMessages: ModelMessage[];
	previousNodeId: string;
	writer: UIMessageStreamWriter<WorkflowUIMessage>;
}

export interface ValidationContext {
	nodes: FlowNode[];
	edges: FlowEdge[];
}
