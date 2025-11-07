import { getNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes";
import type {
	CycleError,
	FlowEdge,
	FlowNode,
	InvalidNodeConfigError,
	MultipleOutgoingError,
	NoEndNodeError,
	NoStartNodeError,
	UnreachableNodeError,
	ValidationError,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { isNodeOfType } from "@/registry/blocks/workflow-01/lib/workflow/types";

type ValidationResult = {
	valid: boolean;
	errors: ValidationError[];
	warnings: string[];
};

/**
 * Main validation function - validates the entire workflow
 * Explores all possible paths to detect structural issues
 */
export function validateWorkflow(
	nodes: FlowNode[],
	edges: FlowEdge[],
): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: string[] = [];

	const startNodeError = ensureSingleStartNode(nodes);
	if (startNodeError) {
		errors.push(startNodeError);
	}

	const endNodeError = ensureAtLeastOneEndNode(nodes);
	if (endNodeError) {
		errors.push(endNodeError);
	}

	const multipleOutgoingErrors = checkForMultipleHandleOutputs(edges);
	errors.push(...multipleOutgoingErrors);

	const nodeSpecificErrors = validateAllNodeSpecificRules(nodes, edges);
	errors.push(...nodeSpecificErrors);

	const cycleErrors = detectCycles(nodes, edges);
	errors.push(...cycleErrors);

	const unreachableError = detectUnreachableNodes(nodes, edges);
	if (unreachableError && unreachableError.nodes.length > 0) {
		warnings.push(unreachableError.message);
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
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
 * Enforce graph structure: Ensure exactly one start node exists
 */
function ensureSingleStartNode(nodes: FlowNode[]): NoStartNodeError | null {
	const startNodes = nodes.filter((node) => isNodeOfType(node, "start"));

	if (startNodes.length === 0) {
		return {
			type: "no-start-node",
			message: "Workflow must have exactly one start node",
			count: 0,
		};
	}

	if (startNodes.length > 1) {
		return {
			type: "no-start-node",
			message: `Workflow has ${startNodes.length} start nodes, but must have exactly one`,
			count: startNodes.length,
		};
	}

	return null;
}

/**
 * Enforce graph structure: Ensure at least one end node exists
 */
function ensureAtLeastOneEndNode(nodes: FlowNode[]): NoEndNodeError | null {
	const endNodes = nodes.filter((node) => isNodeOfType(node, "end"));

	if (endNodes.length === 0) {
		return {
			type: "no-end-node",
			message: "Workflow must have at least one end node",
		};
	}

	return null;
}

/**
 * Enforce connection rules: Check for multiple outputs from a single source handle
 */
function checkForMultipleHandleOutputs(
	edges: FlowEdge[],
): MultipleOutgoingError[] {
	const errors: MultipleOutgoingError[] = [];
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
 * Delegate to each node definition for its own internal validation rules
 */
function validateAllNodeSpecificRules(
	nodes: FlowNode[],
	edges: FlowEdge[],
): InvalidNodeConfigError[] {
	const errors: InvalidNodeConfigError[] = [];

	for (const node of nodes) {
		const definition = getNodeDefinition(node.type);
		if (definition) {
			const context = { nodes, edges };
			// biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for registry-based validation
			const nodeErrors = definition.shared.validate(node as any, context);
			errors.push(...(nodeErrors as InvalidNodeConfigError[]));
		} else {
			errors.push({
				type: "invalid-node-config",
				message: `Unknown node type: ${node.type}`,
				node: { id: node.id },
			});
		}
	}

	return errors;
}

/**
 * Detect cycles by exploring all possible paths through if-else branches
 */
function detectCycles(nodes: FlowNode[], edges: FlowEdge[]): CycleError[] {
	const errors: CycleError[] = [];
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
 * Detect unreachable nodes by doing a full traversal from start
 */
function detectUnreachableNodes(
	nodes: FlowNode[],
	edges: FlowEdge[],
): UnreachableNodeError | null {
	const startNode = nodes.find((node) => isNodeOfType(node, "start"));
	if (!startNode) {
		return null;
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

	const unreachableNodes = nodes
		.filter(
			(node: FlowNode) =>
				!reachable.has(node.id) && !isNodeOfType(node, "note"),
		)
		.map((node: FlowNode) => ({ id: node.id }));

	if (unreachableNodes.length > 0) {
		return {
			type: "unreachable-node",
			message: `${unreachableNodes.length} node(s) are unreachable from the start node`,
			nodes: unreachableNodes,
		};
	}

	return null;
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
