import { createExecutionEngine } from "@/registry/blocks/flow-01/lib/execution/execution-engine";
import { serverNodeProcessors } from "@/registry/blocks/flow-01/lib/execution/server/server-node-processors";
import type { WorkflowDefinition } from "@/registry/blocks/flow-01/types/workflow";
import type { NodeExecutionState } from "@/registry/blocks/flow-01/types/execution";

function createEvent(type: string, data: Record<string, unknown>) {
	return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

function createServerExecutionEngine(
	workflow: WorkflowDefinition,
	controller: ReadableStreamDefaultController,
) {
	return createExecutionEngine({
		workflow,
		processNode: async (nodeId, targetsData) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				throw new Error(`Node ${nodeId} not found`);
			}

			const processor = serverNodeProcessors[node.type];
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
	controller: ReadableStreamDefaultController,
) {
	const engine = createServerExecutionEngine(workflow, controller);

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
