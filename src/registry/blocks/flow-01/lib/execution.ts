import type { WorkflowDefinition } from "@/registry/blocks/flow-01/types/workflow";
import type { FlowNode } from "@/registry/blocks/flow-01/types/flow";
import type { ToolResult } from "@/registry/blocks/flow-01/types/ai";

type ExecutionHandlers = {
	getNodeInputs: (nodeId: string) => Promise<Record<string, string>>;
	processNode: (
		node: FlowNode,
		inputs: Record<string, string>,
	) => Promise<{
		sources: Record<string, string>;
		toolResults?: ToolResult[];
	}>;
	updateNodeState: (
		nodeId: string,
		state: FlowNode["data"]["executionState"],
	) => void;
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
			// Update node to processing state
			handlers.updateNodeState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "processing",
			});

			// Get inputs from connected nodes
			const inputs = await handlers.getNodeInputs(nodeId);

			// Process node with type-specific handler
			const result = await handlers.processNode(node, inputs);

			// Update node state with results
			handlers.updateNodeState(nodeId, {
				timestamp: new Date().toISOString(),
				sources: result.sources,
				status: "success",
			});

			// Process tool results if available
			/* if (result.toolResults) {
				processToolResults(nodeId, result.toolResults, workflow, handlers);
			} */
		} catch (error) {
			handlers.updateNodeState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "error",
				error: error instanceof Error ? error.message : "Unknown error",
			});
		}
	}
}

/* function processToolResults(
	sourceId: string,
	toolResults: ToolResult[],
	workflow: WorkflowDefinition,
	handlers: ExecutionHandlers,
) {
	const toolEdges = workflow.edges.filter(
		(edge) => edge.source === sourceId && edge.sourceHandle !== "output",
	);

	for (const tool of toolResults) {
		const matchingEdge = toolEdges.find((e) => e.sourceHandle === tool.id);
		if (matchingEdge) {
			handlers.updateNodeState(matchingEdge.target, {
				timestamp: new Date().toISOString(),
				targets: {
					[matchingEdge.targetHandle]: tool.result,
				},
				status: "success",
			});
		}
	}
} */
