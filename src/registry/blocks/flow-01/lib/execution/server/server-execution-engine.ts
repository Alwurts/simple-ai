import { createClientExecutionEngine } from "@/registry/blocks/flow-01/lib/execution/client/client-execution-engine";
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
	return createClientExecutionEngine({
		workflow,
		processNode: async (nodeId, targetsData) => {
			// Send processing start event
			controller.enqueue(
				createEvent("progress", {
					nodeId,
					status: "processing",
					timestamp: new Date().toISOString(),
				}),
			);

			try {
				const node = workflow.nodes.find((n) => n.id === nodeId);
				if (!node) {
					throw new Error(`Node ${nodeId} not found`);
				}

				const processor = serverNodeProcessors[node.type];
				const result = await processor(node, targetsData);

				// Send node update event
				controller.enqueue(
					createEvent("nodeUpdate", {
						nodeId,
						executionState: {
							status: "success",
							sources: result,
							targets: targetsData,
							timestamp: new Date().toISOString(),
						},
					}),
				);

				return result;
			} catch (error) {
				// Send error event
				controller.enqueue(
					createEvent("error", {
						nodeId,
						error: error instanceof Error ? error.message : "Unknown error",
					}),
				);
				throw error;
			}
		},
		getNodeTargetsData: (nodeId) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				return undefined;
			}

			const edgesConnectedToNode = workflow.edges.filter(
				(edge) => edge.target === nodeId,
			);

			const targetsData: Record<string, string> = {};
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
		},
		updateNodeExecutionState: (nodeId, state: Partial<NodeExecutionState>) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				return;
			}

			node.data.executionState = {
				...node.data.executionState,
				...state,
				timestamp: state.timestamp || new Date().toISOString(),
			} as NodeExecutionState;
		},
		getNodeById: (nodeId) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				throw new Error(`Node ${nodeId} not found`);
			}
			return node;
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
