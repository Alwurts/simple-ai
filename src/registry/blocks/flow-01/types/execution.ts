import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";
import type {
	CycleError,
	MissingConnectionError,
	MultipleSourcesError,
} from "@/registry/blocks/flow-01/types/workflow";

export type ProcessingNodeError = {
	message: string;
	type: "processing-node";
};

export type NodeProcessor = (
	node: FlowNode,
	targetsData: Record<string, string> | undefined,
) => Promise<Record<string, string> | undefined>;

export type NodeExecutionStatus = "success" | "error" | "processing" | "idle";

export type NodeExecutionState = {
	timestamp: string;
	targets?: Record<string, string>;
	sources?: Record<string, string>;
	status: NodeExecutionStatus;
	error?: MissingConnectionError | ProcessingNodeError;
};

// Edge Execution State
export type EdgeExecutionState = {
	error?: MultipleSourcesError | CycleError;
};
