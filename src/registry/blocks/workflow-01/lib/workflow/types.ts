import type { JSONSchema7 } from "ai";
import type { StatusEdge } from "@/registry/blocks/workflow-01/components/workflow/status-edge";
import type {
	FlowNode,
	FlowNodeType,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes";

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

export type { FlowNode, FlowNodeType };

export type FlowEdge = StatusEdge;

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

export function isNodeOfType<T extends FlowNode["type"]>(
	node: FlowNode,
	type: T,
): node is Extract<FlowNode, { type: T }> {
	return node.type === type;
}
