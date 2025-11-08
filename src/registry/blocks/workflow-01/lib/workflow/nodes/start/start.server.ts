import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "../types";
import type { StartNode } from "./start.shared";

function executeStartNode(
	context: ExecutionContext<StartNode>,
): NodeExecutionResult {
	const { node, edges, writer } = context;

	const result = {
		text: "start",
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

export const startServerDefinition: NodeServerDefinition<StartNode> = {
	execute: executeStartNode,
};
