import { getNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import type {
	FlowEdge,
	FlowNode,
	ValidationError,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { isNodeOfType } from "@/registry/blocks/workflow-01/lib/workflow/types";

type ValidationResult = {
	valid: boolean;
	errors: ValidationError[];
	warnings: ValidationError[];
};

/**
 * Get all node IDs reachable from the start node using BFS traversal.
 * Returns a Set of node IDs that can be reached from the start node.
 */
function getReachableNodeIds(
	nodes: FlowNode[],
	edges: FlowEdge[],
): Set<string> {
	const startNode = nodes.find((node) => isNodeOfType(node, "start"));
	if (!startNode) {
		return new Set<string>();
	}

	const reachable = new Set<string>();
	const queue: string[] = [startNode.id];

	while (queue.length > 0) {
		// biome-ignore lint/style/noNonNullAssertion: We checked queue.length > 0
		const nodeId = queue.shift()!;
		if (reachable.has(nodeId)) {
			continue;
		}

		reachable.add(nodeId);

		const outgoingEdges = edges.filter((e) => e.source === nodeId);
		for (const edge of outgoingEdges) {
			if (!reachable.has(edge.target)) {
				queue.push(edge.target);
			}
		}
	}

	return reachable;
}

/**
 * Get all nodes reachable from the start node.
 * Only validates reachable nodes to avoid cluttering the UI with errors from disconnected nodes.
 */
function getReachableNodes(nodes: FlowNode[], edges: FlowEdge[]): FlowNode[] {
	const reachableIds = getReachableNodeIds(nodes, edges);
	return nodes.filter((node) => reachableIds.has(node.id));
}

/**
 * Separates validation errors into errors and warnings based on severity.
 */
function separateErrorsAndWarnings(
	validationErrors: ValidationError[],
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	for (const error of validationErrors) {
		if (error.severity === "warning") {
			warnings.push(error);
		} else {
			errors.push(error);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Validates the entire workflow by running validation phases in order.
 * Only validates reachable nodes to avoid cluttering the UI with errors from disconnected nodes.
 */
export function validateWorkflow(
	nodes: FlowNode[],
	edges: FlowEdge[],
): ValidationResult {
	const errors: ValidationError[] = [];

	errors.push(...validateGraphStructure(nodes));
	errors.push(...validateEdgeConstraints(edges));
	errors.push(...validateNoCycles(nodes, edges));

	const reachableNodes = getReachableNodes(nodes, edges);
	errors.push(...validateNodeConfigurations(reachableNodes, edges));
	errors.push(...validateReachability(nodes, reachableNodes));

	return separateErrorsAndWarnings(errors);
}

/**
 * Check if a connection is valid before making it
 * Used for real-time validation during connection attempts
 */
export function isValidConnection({
	sourceNodeId,
	sourceHandle,
	targetNodeId,
	targetHandle: _targetHandle,
	nodes,
	edges,
}: {
	sourceNodeId: string;
	sourceHandle: string | null;
	targetNodeId: string;
	targetHandle: string | null;
	nodes: FlowNode[];
	edges: FlowEdge[];
}): boolean {
	const sourceNode = nodes.find((n) => n.id === sourceNodeId);
	const targetNode = nodes.find((n) => n.id === targetNodeId);

	if (!sourceNode || !targetNode) {
		return false;
	}

	if (sourceNodeId === targetNodeId) {
		return false;
	}

	if (sourceNode.type === "note" || targetNode.type === "note") {
		return false;
	}

	if (targetNode.type === "start") {
		return false;
	}

	if (sourceNode.type === "end") {
		return false;
	}

	const existingSourceEdge = edges.find(
		(e) => e.source === sourceNodeId && e.sourceHandle === sourceHandle,
	);
	if (existingSourceEdge) {
		return false;
	}

	return true;
}

/**
 * Check if a specific handle can accept more connections
 * Used for UI feedback to show if a handle is available
 */
export function canConnectHandle(params: {
	nodeId: string;
	handleId: string;
	type: "source" | "target";
	nodes: FlowNode[];
	edges: FlowEdge[];
}): boolean {
	const { nodeId, handleId, type, nodes, edges } = params;
	const node = nodes.find((n) => n.id === nodeId);

	if (!node) {
		return true;
	}

	if (node.type === "note") {
		return false;
	}

	if (node.type === "start" && type === "target") {
		return false;
	}

	if (node.type === "end" && type === "source") {
		return false;
	}

	if (type === "source") {
		const existingEdge = edges.find(
			(e) => e.source === nodeId && e.sourceHandle === handleId,
		);
		if (existingEdge) {
			return false;
		}
	}

	return true;
}

/**
 * Validates graph structure requirements: exactly one start node and at least one end node.
 */
function validateGraphStructure(nodes: FlowNode[]): ValidationError[] {
	const errors: ValidationError[] = [];

	const startNodes = nodes.filter((node) => isNodeOfType(node, "start"));
	if (startNodes.length === 0) {
		errors.push({
			type: "no-start-node",
			severity: "error",
			message: "Workflow must have exactly one start node",
			count: 0,
		});
	} else if (startNodes.length > 1) {
		errors.push({
			type: "no-start-node",
			severity: "error",
			message: `Workflow has ${startNodes.length} start nodes, but must have exactly one`,
			count: startNodes.length,
		});
	}

	const endNodes = nodes.filter((node) => isNodeOfType(node, "end"));
	if (endNodes.length === 0) {
		errors.push({
			type: "no-end-node",
			severity: "error",
			message: "Workflow must have at least one end node",
		});
	}

	return errors;
}

/**
 * Validates edge constraints: ensures no source handle has multiple outgoing connections.
 */
function validateEdgeConstraints(edges: FlowEdge[]): ValidationError[] {
	const errors: ValidationError[] = [];
	const sourceHandleMap = new Map<string, FlowEdge[]>();

	for (const edge of edges) {
		const key = `${edge.source}:${edge.sourceHandle || "default"}`;
		const existing = sourceHandleMap.get(key) || [];
		existing.push(edge);
		sourceHandleMap.set(key, existing);
	}

	for (const [key, edgeGroup] of sourceHandleMap.entries()) {
		if (edgeGroup.length > 1) {
			const [sourceId, sourceHandle] = key.split(":");
			errors.push({
				type: "multiple-outgoing-from-source-handle",
				severity: "error",
				message: `Node ${sourceId} handle "${sourceHandle}" has ${edgeGroup.length} outgoing connections (maximum 1 allowed)`,
				edges: edgeGroup.map((e) => ({
					id: e.id,
					source: e.source,
					target: e.target,
					sourceHandle: e.sourceHandle || "",
					targetHandle: e.targetHandle || "",
				})),
			});
		}
	}

	return errors;
}

/**
 * Validates node-specific configuration rules by delegating to each node's validator.
 */
function validateNodeConfigurations(
	nodes: FlowNode[],
	edges: FlowEdge[],
): ValidationError[] {
	const errors: ValidationError[] = [];

	for (const node of nodes) {
		const definition = getNodeDefinition(node.type);
		if (definition) {
			const context = { nodes, edges };
			// biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for registry-based validation
			const nodeErrors = definition.shared.validate(node as any, context);
			errors.push(...(nodeErrors as ValidationError[]));
		} else {
			errors.push({
				type: "invalid-node-config",
				severity: "error",
				message: `Unknown node type: ${node.type}`,
				node: { id: node.id },
			});
		}
	}

	return errors;
}

/**
 * Validates that the workflow contains no cycles by performing DFS traversal.
 */
function validateNoCycles(
	nodes: FlowNode[],
	edges: FlowEdge[],
): ValidationError[] {
	const errors: ValidationError[] = [];
	const visited = new Set<string>();
	const recursionStack = new Set<string>();
	const edgePath: FlowEdge[] = [];

	const startNode = nodes.find((node) => isNodeOfType(node, "start"));
	if (!startNode) {
		return errors;
	}

	function dfs(nodeId: string): void {
		visited.add(nodeId);
		recursionStack.add(nodeId);

		const node = nodes.find((n) => n.id === nodeId);
		if (!node) {
			return;
		}

		const outgoingEdges = edges.filter((e) => e.source === nodeId);

		for (const edge of outgoingEdges) {
			edgePath.push(edge);

			if (!visited.has(edge.target)) {
				dfs(edge.target);
			} else if (recursionStack.has(edge.target)) {
				const cycleStartIndex = edgePath.findIndex(
					(e) => e.target === edge.target,
				);
				const cycleEdges = edgePath.slice(cycleStartIndex);

				errors.push({
					type: "cycle",
					severity: "error",
					message: `Cycle detected in workflow involving nodes: ${cycleEdges.map((e) => e.source).join(" → ")} → ${edge.target}`,
					edges: cycleEdges.map((e) => ({
						id: e.id,
						source: e.source,
						target: e.target,
						sourceHandle: e.sourceHandle || "",
						targetHandle: e.targetHandle || "",
					})),
				});
			}

			edgePath.pop();
		}

		recursionStack.delete(nodeId);
	}

	dfs(startNode.id);

	return errors;
}

/**
 * Validates reachability and generates warnings for unreachable nodes.
 * Note nodes are excluded from reachability checks as they are informational only.
 */
function validateReachability(
	allNodes: FlowNode[],
	reachableNodes: FlowNode[],
): ValidationError[] {
	const errors: ValidationError[] = [];
	const reachableIds = new Set(reachableNodes.map((n) => n.id));

	const unreachableNodes = allNodes
		.filter(
			(node) => !reachableIds.has(node.id) && !isNodeOfType(node, "note"),
		)
		.map((node) => ({ id: node.id }));

	if (unreachableNodes.length > 0) {
		errors.push({
			type: "unreachable-node",
			severity: "warning",
			message: `${unreachableNodes.length} node(s) are unreachable from the start node`,
			nodes: unreachableNodes,
		});
	}

	return errors;
}

/**
 * Get all node IDs that are affected by a validation error
 */
function getAffectedNodeIds(error: ValidationError): string[] {
	switch (error.type) {
		case "no-start-node":
		case "no-end-node":
			return []; // Global errors, no specific node

		case "invalid-node-config":
			return [error.node.id];

		case "invalid-condition":
			return [error.condition.nodeId];

		case "unreachable-node":
			return error.nodes.map((n) => n.id);

		case "cycle":
		case "multiple-outgoing-from-source-handle":
		case "multiple-sources-for-target-handle": {
			const nodeIds = new Set<string>();
			for (const edge of error.edges) {
				nodeIds.add(edge.source);
				nodeIds.add(edge.target);
			}
			return Array.from(nodeIds);
		}

		case "missing-required-connection":
			return [error.node.id];

		default: {
			// biome-ignore lint/correctness/noUnusedVariables: exhaustive check
			const exhaustiveCheck: never = error;
			return [];
		}
	}
}

/**
 * Get all edge IDs that are affected by a validation error
 */
function getAffectedEdgeIds(error: ValidationError): string[] {
	switch (error.type) {
		case "cycle":
		case "multiple-outgoing-from-source-handle":
		case "multiple-sources-for-target-handle":
			return error.edges.map((e) => e.id);

		default:
			return [];
	}
}

/**
 * Check if a specific node is affected by any validation errors
 */
export function getErrorsForNode(
	nodeId: string,
	errors: ValidationError[],
): ValidationError[] {
	return errors.filter((error) => getAffectedNodeIds(error).includes(nodeId));
}

/**
 * Check if a specific edge is affected by any validation errors
 */
export function getErrorsForEdge(
	edgeId: string,
	errors: ValidationError[],
): ValidationError[] {
	return errors.filter((error) => getAffectedEdgeIds(error).includes(edgeId));
}
