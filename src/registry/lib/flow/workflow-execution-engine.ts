import type { FlowNode } from "@/registry/hooks/flow/use-workflow";
import type {
	CycleError,
	MissingConnectionError,
	MultipleSourcesError,
	WorkflowDefinition,
} from "@/registry/lib/flow/workflow";

// Processing

export type ProcessingNodeError = {
	message: string;
	type: "processing-node";
};

export type ProcessedData = Record<string, string> | undefined;

export type NodeProcessor = (
	node: FlowNode,
	targetsData: ProcessedData,
) => Promise<ProcessedData>;

// Node Execution State

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

// Excution Engine

interface ExecutionContext {
	workflow: WorkflowDefinition;
	processNode: (
		nodeId: string,
		targetsData: ProcessedData,
	) => Promise<ProcessedData>;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState>,
	) => void;
}

export const createWorkflowExecutionEngine = (context: ExecutionContext) => {
	const completedNodes = new Set<string>();
	const failedNodes = new Set<string>();
	const processingNodes = new Set<string>();

	const getNodeTargetsData = (
		workflow: WorkflowDefinition,
		nodeId: string,
	): ProcessedData => {
		const node = workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return undefined;
		}

		const edgesConnectedToNode = workflow.edges.filter(
			(edge) => edge.target === nodeId,
		);

		const targetsData: ProcessedData = {};
		for (const edge of edgesConnectedToNode) {
			const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
			if (!sourceNode?.data.executionState?.sources) {
				continue;
			}

			const sourceNodeResult =
				sourceNode.data.executionState.sources[edge.sourceHandle];
			targetsData[edge.targetHandle] = sourceNodeResult;
		}

		return targetsData;
	};

	const canProcessNode = (nodeId: string) => {
		const nodeDependencies = context.workflow.dependencies[nodeId] || [];
		return nodeDependencies.every((dep) => {
			// Check if any dependency has failed
			if (failedNodes.has(dep.node)) {
				return false;
			}
			// Check if the node is completed AND the specific source handle has data
			const sourceNode = context.workflow.nodes.find((n) => n.id === dep.node);
			if (!sourceNode?.data.executionState?.sources) {
				return false;
			}
			const sourceHandleData =
				sourceNode.data.executionState.sources[dep.sourceHandle];
			return completedNodes.has(dep.node) && sourceHandleData !== undefined;
		});
	};

	const processNode = async (nodeId: string) => {
		try {
			const targetsData = getNodeTargetsData(context.workflow, nodeId);

			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "processing",
				targets: targetsData,
			});

			const result = await context.processNode(nodeId, targetsData);

			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				targets: targetsData,
				sources: result,
				status: "success",
			});

			completedNodes.add(nodeId);
			processingNodes.delete(nodeId);
		} catch (error) {
			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "error",
				error: {
					type: "processing-node",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			});
			console.error(error);
			processingNodes.delete(nodeId);
			failedNodes.add(nodeId); // Track failed nodes separately
		}
	};

	return {
		async execute(executionOrder: string[]) {
			// Reset tracking sets
			completedNodes.clear();
			failedNodes.clear();
			processingNodes.clear();

			while (completedNodes.size + failedNodes.size < executionOrder.length) {
				const availableNodes = executionOrder.filter(
					(nodeId) =>
						!completedNodes.has(nodeId) &&
						!failedNodes.has(nodeId) &&
						!processingNodes.has(nodeId) &&
						canProcessNode(nodeId),
				);

				if (availableNodes.length === 0) {
					if (processingNodes.size > 0) {
						await new Promise((resolve) => setTimeout(resolve, 100));
						continue;
					}
					// If there are no available nodes and nothing is processing,
					// but we haven't completed all nodes, it means some nodes
					// couldn't execute due to failed dependencies
					break;
				}

				const processingPromises = availableNodes.map((nodeId) => {
					processingNodes.add(nodeId);
					return processNode(nodeId);
				});

				await Promise.race(processingPromises);
			}
		},
	};
};
