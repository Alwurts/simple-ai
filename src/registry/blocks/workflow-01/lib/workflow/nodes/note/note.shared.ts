import type { Node } from "@xyflow/react";
import { z } from "zod";
import type {
	NodeSharedDefinition,
	ValidationContext,
	ValidationError,
} from "@/registry/blocks/workflow-01/types/workflow";

export const noteNodeDataSchema = z.object({
	content: z.string(),
});

export type NoteNodeData = z.infer<typeof noteNodeDataSchema>;
export type NoteNode = Node<NoteNodeData, "note">;

function validateNoteNode(
	_node: NoteNode,
	_context: ValidationContext,
): ValidationError[] {
	return [];
}

export const noteSharedDefinition: NodeSharedDefinition<NoteNode> = {
	type: "note",
	dataSchema: noteNodeDataSchema,
	validate: validateNoteNode,
};
