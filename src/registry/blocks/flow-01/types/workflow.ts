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

export interface WorkflowError {
	type: "multiple-sources-for-target-handle" | "cycle";
	message: string;
	edges: {
		id: string;
		source: string;
		target: string;
		sourceHandle: string;
		targetHandle: string;
	}[];
}

export interface WorkflowDefinition {
	id: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
	executionOrder: string[];
	dependencies: Dependencies;
	dependents: Dependents;
	errors: WorkflowError[];
}
