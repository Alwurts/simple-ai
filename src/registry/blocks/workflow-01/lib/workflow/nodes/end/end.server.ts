import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "../types";
import type { EndNode } from "./end.shared";

function executeEndNode(
	context: ExecutionContext<EndNode>,
): NodeExecutionResult {
	const { node, writer } = context;

	const result = {
		text: "end",
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

export const endServerDefinition: NodeServerDefinition<EndNode> = {
	execute: executeEndNode,
};
