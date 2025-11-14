import type { Node } from "@xyflow/react";
import { z } from "zod";
import type {
	NodeSharedDefinition,
	ValidationContext,
	ValidationError,
} from "@/registry/blocks/workflow-01/types/workflow";

export const waitNodeDataSchema = z.object({
	status: z.enum(["processing", "error", "success", "idle"]).optional(),
	duration: z.number().min(1).max(3600), // 1 second to 1 hour
	unit: z.enum(["seconds", "minutes", "hours"]),
	validationErrors: z.array(z.any()).optional(),
});

export type WaitNodeData = z.infer<typeof waitNodeDataSchema>;
export type WaitNode = Node<WaitNodeData, "wait">;

/**
 * Validates wait node configuration and connection constraints.
 * Ensures duration is within allowed limits and node has exactly one incoming and one outgoing connection.
 */
function validateWaitNode(
	node: WaitNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];
	const { edges } = context;

	const { duration, unit } = node.data;
	if (duration) {
		let maxDuration: number;
		switch (unit) {
			case "seconds":
				maxDuration = 3600;
				break;
			case "minutes":
				maxDuration = 60;
				break;
			case "hours":
				maxDuration = 24;
				break;
		}

		if (duration > maxDuration) {
			errors.push({
				type: "invalid-node-config",
				severity: "error",
				message: `Duration exceeds maximum for ${unit} (${maxDuration})`,
				node: { id: node.id },
			});
		}
	}

	const incomingEdges = edges.filter((e) => e.target === node.id);
	if (incomingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Wait node must have one incoming connection",
			node: { id: node.id },
		});
	} else if (incomingEdges.length > 1) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: `Wait node can only have one incoming connection (found ${incomingEdges.length})`,
			node: { id: node.id },
		});
	}

	const outgoingEdges = edges.filter((e) => e.source === node.id);
	if (outgoingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Wait node must have one outgoing connection",
			node: { id: node.id },
		});
	} else if (outgoingEdges.length > 1) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: `Wait node can only have one outgoing connection (found ${outgoingEdges.length})`,
			node: { id: node.id },
		});
	}

	return errors;
}

export const waitSharedDefinition: NodeSharedDefinition<WaitNode> = {
	type: "wait",
	dataSchema: waitNodeDataSchema,
	validate: validateWaitNode,
};
