import type {
	ExecutionContext,
	NodeExecutionResult,
	NodeServerDefinition,
} from "../types";
import type { NoteNode } from "./note.shared";

function executeNoteNode(
	_context: ExecutionContext<NoteNode>,
): NodeExecutionResult {
	throw new Error("Note nodes should not be executed");
}

export const noteServerDefinition: NodeServerDefinition<NoteNode> = {
	execute: executeNoteNode,
};
