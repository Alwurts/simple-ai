import type { NoteNode } from "@/registry/blocks/workflow-01/lib/workflow/nodes/note/note.shared";
import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/types";

function executeNoteNode(
	_context: ExecutionContext<NoteNode>,
): NodeExecutionResult {
	throw new Error("Note nodes should not be executed");
}

export const noteServerDefinition: NodeServerDefinition<NoteNode> = {
	execute: executeNoteNode,
};
