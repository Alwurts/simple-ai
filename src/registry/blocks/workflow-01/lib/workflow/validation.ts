import jexl from "jexl";
import type {
	CycleError,
	FlowEdge,
	FlowNode,
	InvalidConditionError,
	InvalidNodeConfigError,
	MultipleOutgoingError,
	NoEndNodeError,
	NoStartNodeError,
	UnreachableNodeError,
	ValidationError,
} from "@/registry/blocks/workflow-01/lib/workflow/types";
import { isNodeOfType } from "@/registry/blocks/workflow-01/lib/workflow/types";
import {
	extractVariableReferences,
	getAvailableVariables,
	isVariableAvailable,
} from "@/registry/blocks/workflow-01/lib/workflow/variables";

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

	// 1. Check for start node
	const startNodeError = validateStartNode(nodes);
	if (startNodeError) {
		errors.push(startNodeError);
	}

	// 2. Check for at least one end node
	const endNodeError = validateEndNode(nodes);
	if (endNodeError) {
		errors.push(endNodeError);
	}

	// 3. Validate multiple outgoing edges from single source handle
	const multipleOutgoingErrors = validateMultipleOutgoing(edges);
	errors.push(...multipleOutgoingErrors);

	// 4. Validate node-specific rules
	const nodeConfigErrors = validateNodeConfigurations(nodes, edges);
	errors.push(...nodeConfigErrors);

	// 5. Validate JEXL conditions in if-else nodes
	const conditionErrors = validateIfElseConditions(nodes);
	errors.push(...conditionErrors);

	// 6. Validate that condition variables exist in incoming edge
	const conditionVariableErrors = validateConditionVariables(nodes, edges);
	errors.push(...conditionVariableErrors);

	// 7. Check for cycles (exploring all possible paths)
	const cycleErrors = detectCycles(nodes, edges);
	errors.push(...cycleErrors);

	// 8. Check for unreachable nodes
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
 * Connection validator for a specific node type
 * Returns true if the handle can accept more connections
 */
type ConnectionValidator = (params: {
	nodeId: string;
	handleId: string;
	type: "source" | "target";
	nodes: FlowNode[];
	edges: FlowEdge[];
}) => boolean;

/**
 * Start node connection rules:
 * - No incoming connections allowed
 * - Max 1 outgoing connection total
 */
const canConnectStartNode: ConnectionValidator = ({ nodeId, type, edges }) => {
	if (type === "target") {
		return false; // Start node cannot have incoming connections
	}

	if (type === "source") {
		const outgoingEdges = edges.filter((e) => e.source === nodeId);
		return outgoingEdges.length === 0; // Max 1 outgoing
	}

	return true;
};

/**
 * Agent node connection rules:
 * - Multiple incoming connections allowed (converging paths)
 * - Max 1 outgoing connection (but 0 is allowed if unreachable)
 */
const canConnectAgentNode: ConnectionValidator = ({ nodeId, type, edges }) => {
	if (type === "target") {
		// Allow multiple incoming connections
		return true;
	}

	if (type === "source") {
		const outgoingEdges = edges.filter((e) => e.source === nodeId);
		return outgoingEdges.length === 0; // Max 1 outgoing
	}

	return true;
};

/**
 * If-else node connection rules:
 * - Multiple incoming connections allowed (converging paths)
 * - Max 1 outgoing per handle (but multiple handles allowed)
 */
const canConnectIfElseNode: ConnectionValidator = ({
	nodeId,
	handleId,
	type,
	edges,
}) => {
	if (type === "target") {
		// Allow multiple incoming connections
		return true;
	}

	if (type === "source") {
		// Can have multiple outgoing, but only one per handle
		const edgeOnHandle = edges.find(
			(e) => e.source === nodeId && e.sourceHandle === handleId,
		);
		return !edgeOnHandle;
	}

	return true;
};

/**
 * End node connection rules:
 * - Multiple incoming connections allowed (converging paths)
 * - No outgoing connections allowed
 */
const canConnectEndNode: ConnectionValidator = ({ type }) => {
	if (type === "target") {
		// Allow multiple incoming connections
		return true;
	}

	if (type === "source") {
		return false; // End node cannot have outgoing connections
	}

	return true;
};

/**
 * Registry of connection validators for all node types
 */
const NODE_CONNECTION_VALIDATORS: Record<
	Exclude<FlowNode["type"], "note">,
	ConnectionValidator
> = {
	start: canConnectStartNode,
	agent: canConnectAgentNode,
	"if-else": canConnectIfElseNode,
	end: canConnectEndNode,
};

/**
 * Check if a connection is valid before making it
 * Used for real-time validation during connection attempts
 */
export function isValidConnection({
	sourceNodeId,
	sourceHandle,
	targetNodeId,
	targetHandle,
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

	// Both nodes must exist
	if (!sourceNode || !targetNode) {
		return false;
	}

	// Cannot connect to itself
	if (sourceNodeId === targetNodeId) {
		return false;
	}

	// Note nodes can't connect to anything
	if (sourceNode.type === "note" || targetNode.type === "note") {
		return false;
	}

	// Use validators to check if source and target can connect
	const sourceValidator = NODE_CONNECTION_VALIDATORS[sourceNode.type];
	const targetValidator = NODE_CONNECTION_VALIDATORS[targetNode.type];

	const sourceCanConnect = sourceValidator({
		nodeId: sourceNodeId,
		handleId: sourceHandle || "default",
		type: "source",
		nodes,
		edges,
	});

	const targetCanConnect = targetValidator({
		nodeId: targetNodeId,
		handleId: targetHandle || "default",
		type: "target",
		nodes,
		edges,
	});

	return sourceCanConnect && targetCanConnect;
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

	// Note nodes don't have handles, so they can't connect
	if (node.type === "note") {
		return false;
	}

	// Use the validator for this node type
	const validator = NODE_CONNECTION_VALIDATORS[node.type];
	return validator({ nodeId, handleId, type, nodes, edges });
}

/**
 * Validate that exactly one start node exists
 */
function validateStartNode(nodes: FlowNode[]): NoStartNodeError | null {
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
 * Validate that at least one end node exists
 */
function validateEndNode(nodes: FlowNode[]): NoEndNodeError | null {
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
 * Validate that no source handle has multiple outgoing edges
 */
function validateMultipleOutgoing(edges: FlowEdge[]): MultipleOutgoingError[] {
	const errors: MultipleOutgoingError[] = [];
	const sourceHandleMap = new Map<string, FlowEdge[]>();

	// Group edges by source + sourceHandle
	for (const edge of edges) {
		const key = `${edge.source}:${edge.sourceHandle || "default"}`;
		const existing = sourceHandleMap.get(key) || [];
		existing.push(edge);
		sourceHandleMap.set(key, existing);
	}

	// Check for multiple outgoing from same source handle
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
 * Validate node-specific configuration rules
 */
function validateNodeConfigurations(
	nodes: FlowNode[],
	edges: FlowEdge[],
): InvalidNodeConfigError[] {
	const errors: InvalidNodeConfigError[] = [];

	for (const node of nodes) {
		// Start node should have no incoming edges
		if (isNodeOfType(node, "start")) {
			const incomingEdges = edges.filter((e) => e.target === node.id);
			if (incomingEdges.length > 0) {
				errors.push({
					type: "invalid-node-config",
					message: "Start node cannot have incoming connections",
					node: { id: node.id },
				});
			}

			// Start node should have exactly one outgoing edge
			const outgoingEdges = edges.filter((e) => e.source === node.id);
			if (outgoingEdges.length === 0) {
				errors.push({
					type: "invalid-node-config",
					message:
						"Start node must have exactly one outgoing connection",
					node: { id: node.id },
				});
			} else if (outgoingEdges.length > 1) {
				errors.push({
					type: "invalid-node-config",
					message: `Start node can only have one outgoing connection (found ${outgoingEdges.length})`,
					node: { id: node.id },
				});
			}
		}

		// End node should have no outgoing edges
		if (isNodeOfType(node, "end")) {
			const outgoingEdges = edges.filter((e) => e.source === node.id);
			if (outgoingEdges.length > 0) {
				errors.push({
					type: "invalid-node-config",
					message: "End node cannot have outgoing connections",
					node: { id: node.id },
				});
			}
		}

		// If-else node should have at least one condition or else branch
		if (isNodeOfType(node, "if-else")) {
			const outgoingEdges = edges.filter((e) => e.source === node.id);
			if (outgoingEdges.length === 0) {
				errors.push({
					type: "invalid-node-config",
					message:
						"If-else node must have at least one outgoing connection",
					node: { id: node.id },
				});
			}

			// Check that all dynamic handles with edges have non-empty conditions
			for (const handle of node.data.dynamicSourceHandles) {
				const edgeForHandle = outgoingEdges.find(
					(e) => e.sourceHandle === handle.id,
				);
				if (edgeForHandle && !handle.condition.trim()) {
					errors.push({
						type: "invalid-node-config",
						message: `If-else condition "${handle.label || handle.id}" has a connection but no condition expression`,
						node: { id: node.id },
					});
				}
			}
		}
	}

	return errors;
}

/**
 * Validate JEXL expressions in if-else nodes
 */
function validateIfElseConditions(nodes: FlowNode[]): InvalidConditionError[] {
	const errors: InvalidConditionError[] = [];

	for (const node of nodes) {
		if (!isNodeOfType(node, "if-else")) {
			continue;
		}

		for (const handle of node.data.dynamicSourceHandles) {
			if (!handle.condition || !handle.condition.trim()) {
				continue; // Empty conditions are checked in node config validation
			}

			try {
				// Try to compile the expression to check syntax
				jexl.compile(handle.condition);
			} catch (error) {
				errors.push({
					type: "invalid-condition",
					message: "Invalid condition expression in if-else node",
					condition: {
						nodeId: node.id,
						handleId: handle.id,
						condition: handle.condition,
						error:
							error instanceof Error
								? error.message
								: String(error),
					},
				});
			}
		}
	}

	return errors;
}

/**
 * Validate that variables referenced in conditions exist in incoming edge
 */
function validateConditionVariables(
	nodes: FlowNode[],
	edges: FlowEdge[],
): InvalidConditionError[] {
	const errors: InvalidConditionError[] = [];

	for (const node of nodes) {
		if (!isNodeOfType(node, "if-else")) {
			continue;
		}

		const availableVariables = getAvailableVariables(node.id, nodes, edges);

		const hasIncomingEdge = edges.some(
			(e) => e.target === node.id && e.targetHandle === "input",
		);

		for (const handle of node.data.dynamicSourceHandles) {
			if (!handle.condition?.trim()) {
				continue;
			}

			// Skip if syntax error (already reported)
			try {
				jexl.compile(handle.condition);
			} catch {
				continue;
			}

			const references = extractVariableReferences(handle.condition);

			// Check if references exist but no input connection
			if (!hasIncomingEdge && references.length > 0) {
				errors.push({
					type: "invalid-condition",
					message:
						"Condition references variables but node has no input connection",
					condition: {
						nodeId: node.id,
						handleId: handle.id,
						condition: handle.condition,
						error: `Variables referenced: ${references.join(", ")}. Connect an input node first.`,
					},
				});
				continue;
			}

			// Validate each reference
			const missingVariables = references.filter((ref) => {
				const isAvailable = isVariableAvailable(
					ref,
					availableVariables,
				);
				return !isAvailable;
			});

			if (missingVariables.length > 0) {
				const availablePaths =
					availableVariables.map((v) => v.path).join(", ") || "none";
				errors.push({
					type: "invalid-condition",
					message: "Condition references undefined variables",
					condition: {
						nodeId: node.id,
						handleId: handle.id,
						condition: handle.condition,
						error: `Not found: ${missingVariables.join(", ")}. Available: ${availablePaths}`,
					},
				});
			}
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

		// Get all outgoing edges (explore all branches for if-else)
		const outgoingEdges = edges.filter((e) => e.source === nodeId);

		for (const edge of outgoingEdges) {
			edgePath.push(edge);

			if (!visited.has(edge.target)) {
				dfs(edge.target);
			} else if (recursionStack.has(edge.target)) {
				// Cycle detected! Find the cycle in edgePath
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

		// Add all targets of outgoing edges (all possible paths)
		const outgoingEdges = edges.filter((e) => e.source === nodeId);
		for (const edge of outgoingEdges) {
			if (!reachable.has(edge.target)) {
				queue.push(edge.target);
			}
		}
	}

	const unreachableNodes = nodes
		.filter(
			(node) => !reachable.has(node.id) && !isNodeOfType(node, "note"),
		)
		.map((node) => ({ id: node.id }));

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
			// Extract unique node IDs from edges
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
