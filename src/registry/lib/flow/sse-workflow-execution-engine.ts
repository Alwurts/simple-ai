import {
	type NodeExecutionState,
	type NodeProcessor,
	createWorkflowExecutionEngine,
} from "@/registry/lib/flow/workflow-execution-engine";
import type { FlowNode } from "@/registry/hooks/flow/use-workflow";
import type { WorkflowDefinition } from "@/registry/lib/flow/workflow";

function createEvent(type: string, data: Record<string, unknown>) {
	return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

function createSSEWorkflowExecutionEngine(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
) {
	return createWorkflowExecutionEngine({
		workflow,
		processNode: async (nodeId, targetsData) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				throw new Error(`Node ${nodeId} not found`);
			}

			const processor = nodeProcessor[node.type];
			return await processor(node, targetsData);
		},
		updateNodeExecutionState: (nodeId, state: Partial<NodeExecutionState>) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				return;
			}

			node.data.executionState = {
				...node.data.executionState,
				...state,
			} as NodeExecutionState;

			// Send node update event
			controller.enqueue(
				createEvent("nodeUpdate", {
					nodeId,
					executionState: node.data.executionState,
				}),
			);

			if (state.status === "error") {
				controller.enqueue(
					createEvent("error", {
						error: state.error,
					}),
				);
			}
		},
	});
}

export async function executeServerWorkflow(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
) {
	const engine = createSSEWorkflowExecutionEngine(
		workflow,
		nodeProcessor,
		controller,
	);

	try {
		await engine.execute(workflow.executionOrder);
		controller.enqueue(
			createEvent("complete", { timestamp: new Date().toISOString() }),
		);
	} catch (error) {
		controller.enqueue(
			createEvent("error", {
				error: error instanceof Error ? error.message : "Unknown error",
			}),
		);
	} finally {
		controller.close();
	}
}
