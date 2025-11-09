import type { EndNode } from "@/registry/blocks/workflow-01/lib/workflow/nodes/end/end.shared";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "@/registry/blocks/workflow-01/types/workflow";

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
