import { Environment } from "@marcbachmann/cel-js";
import type { IfElseNode } from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else/if-else.shared";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "@/registry/blocks/workflow-01/types/workflow";

// Cache the CEL environment since it's stateless and reusable
const celEnv = new Environment();
celEnv.registerVariable("input", "dyn");

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
		const evalContext = {
			input: previousContext.structured
				? previousContext.structured
				: previousContext.text,
		};

		for (const handle of node.data.dynamicSourceHandles) {
			if (!handle.condition || handle.condition.trim() === "") {
				continue;
			}

			try {
				const conditionResult = celEnv.evaluate(
					handle.condition,
					evalContext,
				);

				if (conditionResult === true) {
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
			} catch {
				// Silently continue to next condition if evaluation fails
				// Validation should have caught this earlier
			}
		}

		if (!nextNodeId) {
			const elseEdge = edges.find(
				(edge) =>
					edge.source === node.id &&
					edge.sourceHandle === "output-else",
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
