import type { JSONSchema7 } from "ai";
import type { StatusEdge } from "@/registry/blocks/workflow-01/components/workflow/status-edge";
import type { FlowNode, FlowNodeType } from "./nodes";

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
	message: string;
	type: "multiple-sources-for-target-handle";
	edges: EdgeErrorInfo[];
};

export type MultipleOutgoingError = {
	message: string;
	type: "multiple-outgoing-from-source-handle";
	edges: EdgeErrorInfo[];
};

export type CycleError = {
	message: string;
	type: "cycle";
	edges: EdgeErrorInfo[];
};

export type MissingConnectionError = {
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
	message: string;
	type: "invalid-condition";
	condition: ConditionErrorInfo;
};

export type NoStartNodeError = {
	message: string;
	type: "no-start-node";
	count: number;
};

export type NoEndNodeError = {
	message: string;
	type: "no-end-node";
};

export type UnreachableNodeError = {
	message: string;
	type: "unreachable-node";
	nodes: NodeErrorInfo[];
};

export type InvalidNodeConfigError = {
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
