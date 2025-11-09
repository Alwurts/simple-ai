import type { Node } from "@xyflow/react";
import { z } from "zod";
import type {
	NodeSharedDefinition,
	ValidationContext,
	ValidationError,
} from "@/registry/blocks/workflow-01/types/workflow";

export const endNodeDataSchema = z.object({
	status: z.enum(["processing", "error", "success", "idle"]).optional(),
	validationErrors: z.array(z.any()).optional(),
});

export type EndNodeData = z.infer<typeof endNodeDataSchema>;
export type EndNode = Node<EndNodeData, "end">;

/**
 * Validates end node connection constraints: no outgoing edges allowed.
 */
function validateEndNode(
	node: EndNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];
	const { edges } = context;

	const outgoingEdges = edges.filter((e) => e.source === node.id);
	if (outgoingEdges.length > 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "End node cannot have outgoing connections",
			node: { id: node.id },
		});
	}

	return errors;
}

export const endSharedDefinition: NodeSharedDefinition<EndNode> = {
	type: "end",
	dataSchema: endNodeDataSchema,
	validate: validateEndNode,
};
