import type { FlowNode } from "@/registry/lib/flow/workflow";
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

	const checkBranchNodeStatus = (nodeId: string): NodeExecutionStatus => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "idle";
		}

		// If this node is processing, the whole branch is processing
		if (processingNodes.has(nodeId)) {
			return "processing";
		}

		// If this node has failed, the branch has failed
		if (failedNodes.has(nodeId)) {
			return "error";
		}

		// Get all nodes that this node depends on
		const dependencies = context.workflow.dependencies[nodeId] || [];

		// If this node has no dependencies, check its own status
		if (dependencies.length === 0) {
			if (completedNodes.has(nodeId) && node.data.executionState?.sources) {
				return "success";
			}
			return "idle";
		}

		// Check status of all dependencies recursively
		for (const dep of dependencies) {
			const depStatus = checkBranchNodeStatus(dep.node);
			// If any dependency is processing or has error, propagate that status
			if (depStatus === "processing" || depStatus === "error") {
				return depStatus;
			}
		}

		// If we got here and the node is complete with data, the branch is successful
		if (completedNodes.has(nodeId) && node.data.executionState?.sources) {
			return "success";
		}

		return "idle";
	};

	const getBranchStatus = (
		nodeId: string,
		handleId: string,
	): NodeExecutionStatus => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "idle";
		}

		// Get all edges that connect to this handle
		const incomingEdges = context.workflow.edges.filter(
			(edge) => edge.target === nodeId && edge.targetHandle === handleId,
		);

		// For each incoming edge, check the status of its source node and all its descendants
		for (const edge of incomingEdges) {
			const branchStatus = checkBranchNodeStatus(edge.source);
			if (branchStatus !== "idle") {
				return branchStatus;
			}
		}

		return "idle";
	};

	const canProcessNode = (nodeId: string) => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return false;
		}

		// Special handling for prompt-crafter nodes
		if (node.type === "prompt-crafter") {
			// Get all target handles from dynamic handles
			const targetHandles = (
				node.data.dynamicHandles?.["template-tags"] || []
			).map((handle) => handle.id);

			// Check each target handle's branch status
			const branchStatuses = targetHandles.map((handleId) =>
				getBranchStatus(nodeId, handleId),
			);

			// Node can process if ALL branches are complete and NONE are processing
			const allBranchesComplete = branchStatuses.every(
				(status) => status === "success",
			);
			const hasProcessingBranch = branchStatuses.some(
				(status) => status === "processing",
			);

			return allBranchesComplete && !hasProcessingBranch;
		}

		// For regular nodes, check all dependencies
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
