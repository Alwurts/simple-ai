import { createExecutionEngine } from "@/registry/blocks/flow-01/lib/execution/core-engine";
import { nodeProcessors } from "@/registry/blocks/flow-01/lib/node-processors-server";
import type { NodeExecutionState } from "@/registry/blocks/flow-01/types/flow";
import type { WorkflowDefinition } from "@/registry/blocks/flow-01/types/workflow";
import { NextResponse } from "next/server";

export const maxDuration = 30;

function createEvent(type: string, data: Record<string, unknown>) {
	return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

export async function POST(req: Request) {
	try {
		const { workflow } = await req.json();

		if (!workflow) {
			return NextResponse.json(
				{ error: "No workflow data provided" },
				{ status: 400 },
			);
		}

		const workflowDefinition: WorkflowDefinition = workflow;

		// Create a stream for SSE
		const stream = new ReadableStream({
			async start(controller) {
				const engine = createExecutionEngine({
					workflow: workflowDefinition,
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
							const node = workflowDefinition.nodes.find(
								(n) => n.id === nodeId,
							);
							if (!node) {
								throw new Error(`Node ${nodeId} not found`);
							}

							const processor = nodeProcessors[node.type];
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
									error:
										error instanceof Error ? error.message : "Unknown error",
								}),
							);
							throw error;
						}
					},
					getNodeTargetsData: (nodeId) => {
						const node = workflowDefinition.nodes.find((n) => n.id === nodeId);
						if (!node) {
							return undefined;
						}

						const edgesConnectedToNode = workflowDefinition.edges.filter(
							(edge) => edge.target === nodeId,
						);

						const targetsData: Record<string, string> = {};
						for (const edge of edgesConnectedToNode) {
							const sourceNode = workflowDefinition.nodes.find(
								(n) => n.id === edge.source,
							);
							if (!sourceNode?.data.executionState?.sources) {
								continue;
							}

							const sourceNodeResult =
								sourceNode.data.executionState.sources[edge.sourceHandle];
							targetsData[edge.targetHandle] = sourceNodeResult;
						}

						return targetsData;
					},
					updateNodeExecutionState: (
						nodeId,
						state: Partial<NodeExecutionState>,
					) => {
						const node = workflowDefinition.nodes.find((n) => n.id === nodeId);
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
						const node = workflowDefinition.nodes.find((n) => n.id === nodeId);
						if (!node) {
							throw new Error(`Node ${nodeId} not found`);
						}
						return node;
					},
				});

				try {
					await engine.execute(workflowDefinition.executionOrder);
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
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
