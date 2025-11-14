import type { Node } from "@xyflow/react";
import { z } from "zod";
import type {
	NodeSharedDefinition,
	ValidationContext,
	ValidationError,
} from "@/registry/blocks/workflow-01/types/workflow";

const textNodeOutputSchema = z.object({
	type: z.literal("text"),
});

const structuredNodeOutputSchema = z.object({
	type: z.literal("structured"),
	schema: z.any().nullable(), // JSONSchema7, but using any for now
});

const nodeOutputSchema = z.discriminatedUnion("type", [
	textNodeOutputSchema,
	structuredNodeOutputSchema,
]);

export const agentNodeDataSchema = z.object({
	name: z.string(),
	model: z.string(),
	systemPrompt: z.string(),
	status: z.enum(["processing", "error", "success", "idle"]),
	selectedTools: z.array(z.string()),
	sourceType: nodeOutputSchema,
	hideResponseInChat: z.boolean(),
	excludeFromConversation: z.boolean(),
	maxSteps: z.number(),
	validationErrors: z.array(z.any()).optional(),
});

export type AgentNodeData = z.infer<typeof agentNodeDataSchema>;
export type AgentNode = Node<AgentNodeData, "agent">;

/**
 * Validates agent node configuration and connection constraints.
 */
function validateAgentNode(
	node: AgentNode,
	context: ValidationContext,
): ValidationError[] {
	const errors: ValidationError[] = [];
	const { edges } = context;

	const outgoingEdges = edges.filter(e => e.source === node.id);
	if (outgoingEdges.length === 0) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Agent node must have one outgoing connection",
			node: { id: node.id },
		});
	} else if (outgoingEdges.length > 1) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: `Agent node can only have one outgoing connection (found ${outgoingEdges.length})`,
			node: { id: node.id },
		});
	}

	if (
		node.data.sourceType.type === "structured" &&
		!node.data.sourceType.schema
	) {
		errors.push({
			type: "invalid-node-config",
			severity: "error",
			message: "Agent node with structured output must have a schema",
			node: { id: node.id },
		});
	}

	return errors;
}

export const agentSharedDefinition: NodeSharedDefinition<AgentNode> = {
	type: "agent",
	dataSchema: agentNodeDataSchema,
	validate: validateAgentNode,
};
