import jexl from "jexl";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "../types";
import type { IfElseNode } from "./if-else.shared";

function executeIfElseNode(
	context: ExecutionContext<IfElseNode>,
): NodeExecutionResult {
	const { node, edges, executionMemory, previousNodeId, writer } = context;

	const result = {
		text: "if-else-routing",
	};

	const previousContext = executionMemory[previousNodeId];

	let nextNodeId: string | null = null;

	if (previousContext) {
		for (const handle of node.data.dynamicSourceHandles) {
			if (!handle.condition || handle.condition.trim() === "") {
				continue;
			}

			try {
				const jexlContext = {
					input: previousContext.structured
						? previousContext.structured
						: previousContext.text,
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

export const ifElseServerDefinition: NodeServerDefinition<IfElseNode> = {
	execute: executeIfElseNode,
};
