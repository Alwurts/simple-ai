import type { WorkflowDefinition } from "@/registry/blocks/flow-01/types/workflow";
import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";

type ExecutionHandlers = {
	getNodeTargetsData: (nodeId: string) => Record<string, string> | undefined;
	updateNodeExecutionState: (
		nodeId: string,
		type: FlowNode["type"],
		state: FlowNode["data"]["executionState"],
	) => void;
	processNode: (
		nodeId: string,
		targetsData: Record<string, string> | undefined,
	) => Promise<Record<string, string> | undefined>;
};

export async function executeWorkflow(
	workflow: WorkflowDefinition,
	handlers: ExecutionHandlers,
) {
	for (const nodeId of workflow.executionOrder) {
		const node = workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			throw new Error(`Node with id ${nodeId} not found in workflow`);
		}

		try {
			const targetsData = handlers.getNodeTargetsData(nodeId);

			handlers.updateNodeExecutionState(nodeId, node.type, {
				timestamp: new Date().toISOString(),
				status: "processing",
				targets: targetsData,
			});

			const result = await handlers.processNode(nodeId, targetsData);

			// Process node with type-specific handler

			// Update node state with results
			handlers.updateNodeExecutionState(nodeId, node.type, {
				timestamp: new Date().toISOString(),
				targets: targetsData,
				sources: result,
				status: "success",
			});

			// Process tool results if available
			/* if (result.toolResults) {
				processToolResults(nodeId, result.toolResults, workflow, handlers);
			} */
		} catch (error) {
			handlers.updateNodeExecutionState(nodeId, node.type, {
				timestamp: new Date().toISOString(),
				status: "error",
				error: error instanceof Error ? error.message : "Unknown error",
			});
			console.error(error);
		}
	}
}
