import type { Node } from "@xyflow/react";
import { z } from "zod";
import type { ValidationError } from "../../types";
import type { NodeSharedDefinition, ValidationContext } from "../types";

const textNodeOutputSchema = z.object({
	type: z.literal("text"),
});

export const startNodeDataSchema = z.object({
	status: z.enum(["processing", "error", "success", "idle"]).optional(),
	sourceType: textNodeOutputSchema,
	validationErrors: z.array(z.any()).optional(),
});

export type StartNodeData = z.infer<typeof startNodeDataSchema>;
export type StartNode = Node<StartNodeData, "start">;

/**
 * Validates start node connection constraints: no incoming edges and exactly one outgoing edge.
 */
function validateStartNode(
	node: StartNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];
	const { edges } = context;

	const incomingEdges = edges.filter((e) => e.target === node.id);
	if (incomingEdges.length > 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Start node cannot have incoming connections",
			node: { id: node.id },
		});
	}

	const outgoingEdges = edges.filter((e) => e.source === node.id);
	if (outgoingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Start node must have exactly one outgoing connection",
			node: { id: node.id },
		});
	} else if (outgoingEdges.length > 1) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: `Start node can only have one outgoing connection (found ${outgoingEdges.length})`,
			node: { id: node.id },
		});
	}

	return errors;
}

export const startSharedDefinition: NodeSharedDefinition<StartNode> = {
	type: "start",
	dataSchema: startNodeDataSchema,
	validate: validateStartNode,
};
