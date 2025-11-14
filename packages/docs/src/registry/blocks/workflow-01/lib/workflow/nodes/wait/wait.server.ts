import type { WaitNode } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.shared";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "@/registry/blocks/workflow-01/types/workflow";

async function executeWaitNode(
	context: ExecutionContext<WaitNode>,
): Promise<NodeExecutionResult> {
	const { node, edges, executionMemory, writer } = context;

	// Get the input data from the previous node
	const previousResult = executionMemory[context.previousNodeId];
	const inputText = previousResult?.text || "";
	const inputStructured = previousResult?.structured;

	// Calculate delay in milliseconds
	const { duration, unit } = node.data;
	let delayMs: number;
	switch (unit) {
		case "seconds":
			delayMs = duration * 1000;
			break;
		case "minutes":
			delayMs = duration * 60 * 1000;
			break;
		case "hours":
			delayMs = duration * 60 * 60 * 1000;
			break;
		default:
			delayMs = duration * 1000; // fallback to seconds
	}

	// Send initial status update
	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: {
				...node.data,
				status: "processing",
			},
		},
	});

	// Wait for the specified duration
	await new Promise(resolve => setTimeout(resolve, delayMs));

	// Send completion status update
	writer.write({
		type: "data-node-execution-state",
		id: node.id,
		data: {
			nodeId: node.id,
			nodeType: node.type,
			data: {
				...node.data,
				status: "success",
			},
		},
	});

	const outgoingEdge = edges.find(edge => edge.source === node.id);
	const nextNodeId = outgoingEdge ? outgoingEdge.target : null;

	return {
		result: {
			text: inputText, // Pass through the input data unchanged
			structured: inputStructured,
		},
		nextNodeId,
	};
}

export const waitServerDefinition: NodeServerDefinition<WaitNode> = {
	execute: executeWaitNode,
};
