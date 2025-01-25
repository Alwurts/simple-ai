import type { FlowEdge, FlowNode } from "@/registry/blocks/flow-01/types/flow";

type Dependency = {
	node: string;
	sourceHandle: string;
};

type Dependencies = Record<string, Dependency[]>;

type Dependent = {
	node: string;
	targetHandle: string;
};

type Dependents = Record<string, Dependent[]>;

export type DependencyGraph = {
	dependencies: Map<string, { node: string; sourceHandle: string }[]>;
	dependents: Map<string, { node: string; targetHandle: string }[]>;
};

export type ConnectionMap = Map<string, FlowEdge[]>;

// Error types

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

export type CycleError = {
	message: string;
	type: "cycle";
	edges: EdgeErrorInfo[];
};

type NodeErrorInfo = {
	id: string;
	handleId: string;
};

export type MissingConnectionError = {
	message: string;
	type: "missing-required-connection";
	node: NodeErrorInfo;
};

export type WorkflowError =
	| MultipleSourcesError
	| CycleError
	| MissingConnectionError;

export interface WorkflowDefinition {
	id: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
	executionOrder: string[];
	dependencies: Dependencies;
	dependents: Dependents;
	errors: WorkflowError[];
}
