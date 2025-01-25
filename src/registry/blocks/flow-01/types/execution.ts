import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";

export type NodeProcessor = (
	node: FlowNode,
	targetsData: Record<string, string> | undefined,
) => Promise<Record<string, string> | undefined>;

type NodeExecutionStatus = "success" | "error" | "processing" | "idle";

export type NodeExecutionState = {
	timestamp: string;
	targets?: Record<string, string>;
	sources?: Record<string, string>;
	status: NodeExecutionStatus;
	error?: string;
};

// Edge Execution State
export type EdgeExecutionState = {
	error?: {
		type: "multiple-sources-for-target-handle" | "cycle";
		message: string;
	};
};
