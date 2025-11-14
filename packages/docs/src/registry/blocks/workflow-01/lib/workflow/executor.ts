import {
	convertToModelMessages,
	type ModelMessage,
	type UIMessageStreamWriter,
} from "ai";
import { getNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import { validateWorkflow } from "@/registry/blocks/workflow-01/lib/workflow/validation";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/types/messages";
import type {
	ExecutionContext,
	ExecutionResult,
	FlowEdge,
	FlowNode,
	NodeExecutionResult,
} from "@/registry/blocks/workflow-01/types/workflow";
import { isNodeOfType } from "@/registry/blocks/workflow-01/types/workflow";

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

	const errors = validation.errors.filter(e => e.severity === "error");
	if (errors.length > 0) {
		const errorMessages = errors.map(e => `- ${e.message}`).join("\n");
		throw new Error(`Workflow has errors:\n${errorMessages}`);
	}

	// Log warnings but don't block
	const warnings = validation.errors.filter(e => e.severity === "warning");
	if (warnings.length > 0) {
		console.warn("Workflow warnings:", warnings);
	}

	if (validation.warnings.length > 0) {
		console.warn("Workflow warnings (legacy):", validation.warnings);
	}

	const startNode = nodes.find(node => isNodeOfType(node, "start"));
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

	while (currentNodeId) {
		if (stepCount++ > MAX_STEPS) {
			throw new Error(
				"Execution exceeded maximum steps (possible infinite loop)",
			);
		}

		const node = nodes.find(n => n.id === currentNodeId);
		if (!node) {
			throw new Error(`Node ${currentNodeId} not found`);
		}

		if (isNodeOfType(node, "note")) {
			throw new Error(
				`Note node ${currentNodeId} found, but should not be executed`,
			);
		}

		let executionResult: {
			result: ExecutionResult;
			nextNodeId: string | null;
		};

		const nodeName =
			node.type === "agent"
				? (node.data as { name?: string }).name || node.id
				: node.id;

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

			const definition = getNodeDefinition(node.type);
			if (!definition) {
				throw new Error(`Unknown node type: ${node.type}`);
			}

			const context = {
				node,
				nodes,
				edges,
				executionMemory,
				accumulatedMessages,
				previousNodeId,
				writer,
			};
			const registryResult = await (
				definition.server.execute as (
					// biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for registry-based execution
					context: ExecutionContext<any>,
				) => Promise<NodeExecutionResult> | NodeExecutionResult
			)(context);
			executionResult = {
				result: {
					text: registryResult.result.text,
					structured: registryResult.result.structured,
					nodeType: node.type,
					messages: accumulatedMessages,
				},
				nextNodeId: registryResult.nextNodeId,
			};

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
		} catch (error) {
			writer.write({
				type: "data-node-execution-status",
				id: node.id,
				data: {
					nodeId: node.id,
					nodeType: node.type,
					name: nodeName,
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				},
			});

			throw error;
		}

		if (!currentNodeId) {
			break;
		}
	}
}
