import type { NodeExecutionState } from "@/registry/blocks/flow-01/types/execution";
import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";
import type { WorkflowDefinition } from "@/registry/blocks/flow-01/types/workflow";

export interface ExecutionContext {
	workflow: WorkflowDefinition;
	processNode: (
		nodeId: string,
		targetsData: Record<string, string> | undefined,
	) => Promise<Record<string, string> | undefined>;
	getNodeTargetsData: (nodeId: string) => Record<string, string> | undefined;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState>,
	) => void;
	getNodeById: (nodeId: string) => FlowNode;
}

export const createClientExecutionEngine = (context: ExecutionContext) => {
	const completedNodes = new Set<string>();
	const processingNodes = new Set<string>();

	const canProcessNode = (nodeId: string) => {
		const nodeDependencies =
			context.workflow.dependencies[nodeId]?.map((dep) => dep.node) || [];
		return nodeDependencies.every((dep) => completedNodes.has(dep));
	};

	const processNode = async (nodeId: string) => {
		try {
			const targetsData = context.getNodeTargetsData(nodeId);

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
				error: error instanceof Error ? error.message : "Unknown error",
			});
			console.error(error);
			processingNodes.delete(nodeId);
			completedNodes.add(nodeId);
		}
	};

	return {
		async execute(executionOrder: string[]) {
			// Reset tracking sets
			completedNodes.clear();
			processingNodes.clear();

			while (completedNodes.size < executionOrder.length) {
				const availableNodes = executionOrder.filter(
					(nodeId) =>
						!completedNodes.has(nodeId) &&
						!processingNodes.has(nodeId) &&
						canProcessNode(nodeId),
				);

				if (availableNodes.length === 0) {
					if (processingNodes.size > 0) {
						await new Promise((resolve) => setTimeout(resolve, 100));
						continue;
					}
					throw new Error("Unable to complete workflow execution");
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
