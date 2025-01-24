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

type WorkflowError = {
	type: "cycle" | "multiple-sources-for-target-handle";
	message: string;
	edge: FlowEdge;
};

export type WorkFlowResult = {
	executionOrder: string[];
	dependencies: Dependencies;
	dependents: Dependents;
	errors: WorkflowError[];
};

export interface WorkflowDefinition extends WorkFlowResult {
	id: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
}
