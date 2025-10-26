import {
	convertToModelMessages,
	jsonSchema,
	type ModelMessage,
	Output,
	smoothStream,
	stepCountIs,
	streamText,
	type Tool,
	type UIMessageStreamWriter,
} from "ai";
import jexl from "jexl";
import {
	getWorkflowTools,
	type WorkflowToolId,
} from "@/registry/blocks/workflow-01/lib/tools";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/lib/workflow/messages";
import { workflowModel } from "@/registry/blocks/workflow-01/lib/workflow/models";
import type {
	FlowEdge,
	FlowNode,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { isNodeOfType } from "@/registry/blocks/workflow-01/lib/workflow/types";
import { validateWorkflow } from "@/registry/blocks/workflow-01/lib/workflow/validation";

type ExecutionResult = {
	text: string;
	structured?: unknown; // For structured outputs from agents
	nodeType: FlowNode["type"];
	messages?: ModelMessage[];
};

type NodeExecutionResult = {
	result: ExecutionResult;
	nextNodeId: string | null;
};

/**
 * Execute a start node
 * Start nodes don't perform any action, just route to the next node
 */
function executeStartNode({
	node,
	edges,
	writer,
}: {
	node: FlowNode;
	edges: FlowEdge[];
	writer: UIMessageStreamWriter<WorkflowUIMessage>;
}): NodeExecutionResult {
	if (!isNodeOfType(node, "start")) {
		throw new Error(`Node ${node.id} is not a start node`);
	}

	const result: ExecutionResult = {
		text: "start",
		nodeType: "start",
	};

	const outgoingEdge = edges.find((edge) => edge.source === node.id);
	const nextNodeId = outgoingEdge ? outgoingEdge.target : null;

	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: node.data,
		},
	});

	return { result, nextNodeId };
}

/**
 * Execute an agent node
 * Runs the AI agent and routes to the next node
 */
async function executeAgentNode({
	node,
	edges,
	accumulatedMessages,
	writer,
}: {
	node: FlowNode;
	edges: FlowEdge[];
	accumulatedMessages: ModelMessage[];
	writer: UIMessageStreamWriter<WorkflowUIMessage>;
}): Promise<NodeExecutionResult> {
	if (!isNodeOfType(node, "agent")) {
		throw new Error(`Node ${node.id} is not an agent node`);
	}

	let output: Parameters<typeof streamText>[0]["experimental_output"];

	if (node.data.sourceType.type === "structured") {
		const schema = node.data.sourceType.schema;

		if (!schema) {
			throw new Error("Schema is required for structured output");
		}

		const jsonSchemaValue = jsonSchema(schema);
		output = Output.object({
			schema: jsonSchemaValue,
		});
	}

	const tools = getWorkflowTools();
	const agentTools: Partial<Record<WorkflowToolId, Tool>> = {};

	for (const toolId of node.data.selectedTools) {
		if (tools[toolId as WorkflowToolId]) {
			agentTools[toolId as WorkflowToolId] =
				tools[toolId as WorkflowToolId];
		}
	}

	const streamResult = streamText({
		model: workflowModel.languageModel(node.data.model),
		system: node.data.systemPrompt,
		messages: accumulatedMessages,
		tools: agentTools,
		stopWhen: stepCountIs(node.data.maxSteps ?? 5),
		experimental_transform: smoothStream(),
		experimental_output: output,
	});

	if (!node.data.hideResponseInChat) {
		writer.merge(
			streamResult.toUIMessageStream({
				sendStart: false,
				sendFinish: false,
			}),
		);
	}

	const response = await streamResult.response;
	const text = await streamResult.text;

	let structured: unknown;
	if (node.data.sourceType.type === "structured") {
		try {
			structured = JSON.parse(text);
		} catch (e) {
			console.error("Failed to parse structured output:", e);
		}
	}

	if (!node.data.excludeFromConversation) {
		accumulatedMessages.push(...response.messages);
	}

	const result: ExecutionResult = {
		text,
		structured,
		nodeType: "agent",
		messages: response.messages,
	};

	const outgoingEdge = edges.find((edge) => edge.source === node.id);
	const nextNodeId = outgoingEdge ? outgoingEdge.target : null;

	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: node.data,
		},
	});

	return { result, nextNodeId };
}

/**
 * Execute an if-else node
 * Evaluates conditions and routes to the appropriate next node
 */
function executeIfElseNode({
	node,
	edges,
	executionMemory,
	previousNodeId,
	writer,
}: {
	node: FlowNode;
	edges: FlowEdge[];
	executionMemory: Record<string, ExecutionResult>;
	previousNodeId: string;
	writer: UIMessageStreamWriter<WorkflowUIMessage>;
}): NodeExecutionResult {
	if (!isNodeOfType(node, "if-else")) {
		throw new Error(`Node ${node.id} is not an if-else node`);
	}

	const result: ExecutionResult = {
		text: "if-else-routing",
		nodeType: "if-else",
	};

	const context = executionMemory[previousNodeId];

	let nextNodeId: string | null = null;

	if (context) {
		for (const handle of node.data.dynamicSourceHandles) {
			if (!handle.condition || handle.condition.trim() === "") {
				continue;
			}

			try {
				const jexlContext = {
					input: context.structured
						? context.structured
						: context.text,
				};

				const conditionResult = jexl.evalSync(
					handle.condition,
					jexlContext,
				);

				if (conditionResult) {
					const outgoingEdge = edges.find(
						(edge) =>
							edge.source === node.id &&
							edge.sourceHandle === handle.id,
					);

					if (outgoingEdge) {
						nextNodeId = outgoingEdge.target;
						break;
					}
				}
			} catch (error) {
				console.error(
					`Error evaluating condition: ${handle.condition}`,
					error,
				);
			}
		}

		if (!nextNodeId) {
			const elseEdge = edges.find(
				(edge) =>
					edge.source === node.id && edge.sourceHandle === "else",
			);
			nextNodeId = elseEdge ? elseEdge.target : null;
		}
	}

	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: node.data,
		},
	});

	return { result, nextNodeId };
}

/**
 * Execute an end node
 * End nodes don't perform any action and signal workflow completion
 */
function executeEndNode(
	node: FlowNode,
	writer: UIMessageStreamWriter<WorkflowUIMessage>,
): NodeExecutionResult {
	if (!isNodeOfType(node, "end")) {
		throw new Error(`Node ${node.id} is not an end node`);
	}

	const result: ExecutionResult = {
		text: "end",
		nodeType: "end",
	};

	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: node.data,
		},
	});

	writer.write({
		type: "finish",
	});

	return { result, nextNodeId: null };
}

/**
 * Main workflow execution function
 */
export async function executeWorkflow({
	nodes,
	edges,
	messages,
	writer,
}: {
	nodes: FlowNode[];
	edges: FlowEdge[];
	messages: WorkflowUIMessage[];
	writer: UIMessageStreamWriter<WorkflowUIMessage>;
}): Promise<void> {
	const validation = validateWorkflow(nodes, edges);

	if (!validation.valid) {
		console.error("Workflow validation failed:", validation.errors);
		const errorMessages = validation.errors
			.map((e) => `- ${e.message}`)
			.join("\n");
		throw new Error(`Workflow validation failed:\n${errorMessages}`);
	}

	if (validation.warnings.length > 0) {
		console.warn("Workflow warnings:", validation.warnings);
	}

	const startNode = nodes.find((node) => isNodeOfType(node, "start"));
	if (!startNode) {
		throw new Error("No start node found");
	}

	const executionMemory: Record<string, ExecutionResult> = {};
	const initialMessages = convertToModelMessages(messages);
	const accumulatedMessages: ModelMessage[] = initialMessages;

	let currentNodeId: string | null = startNode.id;
	let previousNodeId: string = startNode.id;
	let stepCount = 0;
	const MAX_STEPS = 100;
	const executionPath: string[] = [currentNodeId];

	while (currentNodeId) {
		if (stepCount++ > MAX_STEPS) {
			throw new Error(
				"Execution exceeded maximum steps (possible infinite loop)",
			);
		}

		const node = nodes.find((n) => n.id === currentNodeId);
		if (!node) {
			throw new Error(`Node ${currentNodeId} not found`);
		}

		if (isNodeOfType(node, "note")) {
			throw new Error(
				`Note node ${currentNodeId} found, but should not be executed`,
			);
		}

		let executionResult: NodeExecutionResult;

		const nodeName = node.type === "agent" ? node.data.name : node.id;

		try {
			writer.write({
				type: "data-node-execution-status",
				id: node.id,
				data: {
					nodeId: node.id,
					nodeType: node.type,
					name: nodeName,
					status: "processing",
				},
			});

			if (isNodeOfType(node, "start")) {
				executionResult = executeStartNode({ node, edges, writer });
			} else if (isNodeOfType(node, "agent")) {
				executionResult = await executeAgentNode({
					node,
					edges,
					accumulatedMessages,
					writer,
				});
			} else if (isNodeOfType(node, "if-else")) {
				executionResult = executeIfElseNode({
					node,
					edges,
					executionMemory,
					previousNodeId,
					writer,
				});
			} else if (isNodeOfType(node, "end")) {
				executionResult = executeEndNode(node, writer);
			} else {
				const exhaustiveCheck: never = node;
				throw new Error(`Unknown node type: ${exhaustiveCheck}`);
			}

			writer.write({
				type: "data-node-execution-status",
				id: node.id,
				data: {
					nodeId: node.id,
					nodeType: node.type,
					name: nodeName,
					status: "success",
				},
			});

			executionMemory[node.id] = executionResult.result;

			previousNodeId = currentNodeId;
			currentNodeId = executionResult.nextNodeId;

			if (currentNodeId) {
				executionPath.push(currentNodeId);
			}
		} catch (error) {
			writer.write({
				type: "data-node-execution-status",
				id: node.id,
				data: {
					nodeId: node.id,
					nodeType: node.type,
					name: nodeName,
					status: "error",
					error:
						error instanceof Error
							? error.message
							: "Unknown error",
				},
			});

			throw error;
		}

		if (!currentNodeId) {
			break;
		}
	}
}
