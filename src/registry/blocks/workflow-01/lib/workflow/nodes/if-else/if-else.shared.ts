import type { Node } from "@xyflow/react";
import jexl from "jexl";
import { z } from "zod";
import type { ValidationError } from "../../types";
import {
	extractVariableReferences,
	getAvailableVariables,
	isVariableAvailable,
} from "../../variables";
import type { NodeSharedDefinition, ValidationContext } from "../types";

const dynamicHandleSchema = z.object({
	id: z.string(),
	label: z.string().nullable(),
	condition: z.string(),
});

export const ifElseNodeDataSchema = z.object({
	status: z.enum(["processing", "error", "success", "idle"]).optional(),
	dynamicSourceHandles: z.array(dynamicHandleSchema),
	validationErrors: z.array(z.any()).optional(),
});

export type IfElseNodeData = z.infer<typeof ifElseNodeDataSchema>;
export type IfElseNode = Node<IfElseNodeData, "if-else">;

function validateIfElseNode(
	node: IfElseNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];

	const { nodes, edges } = context;

	const outgoingEdges = edges.filter((e) => e.source === node.id);
	if (outgoingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			message: "If-else node must have at least one outgoing connection",
			node: { id: node.id },
		});
	}

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

		if (handle.condition?.trim()) {
			try {
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

		if (handle.condition?.trim()) {
			const availableVariables = getAvailableVariables(
				node.id,
				nodes,
				edges,
			);
			const hasIncomingEdge = edges.some(
				(e) => e.target === node.id && e.targetHandle === "input",
			);
			const references = extractVariableReferences(handle.condition);

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
			} else {
				const missingVariables = references.filter((ref) => {
					const isAvailable = isVariableAvailable(
						ref,
						availableVariables,
					);
					return !isAvailable;
				});

				if (missingVariables.length > 0) {
					const availablePaths =
						availableVariables.map((v) => v.path).join(", ") ||
						"none";
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
	}

	return errors;
}

export const ifElseSharedDefinition: NodeSharedDefinition<IfElseNode> = {
	type: "if-else",
	dataSchema: ifElseNodeDataSchema,
	validate: validateIfElseNode,
};
