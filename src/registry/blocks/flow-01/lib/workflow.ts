import type { FlowEdge, FlowNode } from "@/registry/blocks/flow-01/types/flow";
import type {
	WorkflowDefinition,
	WorkFlowResult,
} from "@/registry/blocks/flow-01/types/workflow";
import { nanoid } from "nanoid";

export function prepareWorkflow(
	nodes: FlowNode[],
	edges: FlowEdge[],
): WorkflowDefinition {
	const dependencies = new Map<
		string,
		WorkFlowResult["dependencies"][number]
	>();
	const dependents = new Map<string, WorkFlowResult["dependents"][number]>();
	const targetHandleConnections = new Map<string, FlowEdge>(); // Changed to store the entire edge
	const errors: WorkFlowResult["errors"] = []; // To collect validation errors

	// Build dependency graph
	for (const edge of edges) {
		const targetHandleKey = `${edge.target}-${edge.targetHandle}`;
		if (targetHandleConnections.has(targetHandleKey)) {
			const existingEdge = targetHandleConnections.get(targetHandleKey);
			errors.push({
				type: "multiple-sources-for-target-handle",
				message: `Target handle "${edge.targetHandle}" on node "${edge.target}" is already connected to source node "${existingEdge?.source}".`,
				edge: {
					id: edge.id,
					source: edge.source,
					target: edge.target,
					sourceHandle: edge.sourceHandle,
					targetHandle: edge.targetHandle,
				},
			});
			continue; // Skip this edge to avoid adding it to the graph
		}
		targetHandleConnections.set(targetHandleKey, edge);

		// For dependencies, we're recording the source node and its handle
		if (!dependencies.has(edge.target)) {
			dependencies.set(edge.target, []);
		}
		dependencies.get(edge.target)?.push({
			node: edge.source,
			sourceHandle: edge.sourceHandle,
		});

		// For dependents, we're recording the target node and its handle
		if (!dependents.has(edge.source)) {
			dependents.set(edge.source, []);
		}
		dependents.get(edge.source)?.push({
			node: edge.target,
			targetHandle: edge.targetHandle,
		});
	}

	// Topological sort using Kahn's algorithm
	const executionOrder: string[] = [];
	const indegree = new Map<string, number>();
	const queue: string[] = [];

	for (const node of nodes) {
		const degree = dependencies.get(node.id)?.length || 0;
		indegree.set(node.id, degree);
		if (degree === 0) {
			queue.push(node.id);
		}
	}

	while (queue.length > 0) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const nodeId = queue.shift()!;
		executionOrder.push(nodeId);

		const dependentIds = dependents.get(nodeId);
		if (dependentIds) {
			for (const dependent of dependentIds) {
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				const current = indegree.get(dependent.node)! - 1;
				indegree.set(dependent.node, current);
				if (current === 0) {
					queue.push(dependent.node);
				}
			}
		}
	}

	if (executionOrder.length !== nodes.length) {
		// For cycle errors, we might not have a specific edge, so we'll use a dummy edge
		errors.push({
			type: "cycle",
			message: "Workflow contains cycles.",
			edge: {
				id: "",
				source: "",
				target: "",
				sourceHandle: "",
				targetHandle: "",
			},
		});
	}

	// Convert Maps to plain objects for JSON serialization
	return {
		id: nanoid(),
		nodes,
		edges,
		executionOrder,
		dependencies: Object.fromEntries(dependencies),
		dependents: Object.fromEntries(dependents),
		errors, // Include the collected errors in the output
	};
}
