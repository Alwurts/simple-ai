import { noteClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/note/note.client";
import { noteServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/note/note.server";
import {
	type NoteNode,
	noteSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/note/note.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/types/workflow";

export const noteNodeDefinition: NodeDefinition<NoteNode> = {
	shared: noteSharedDefinition,
	client: noteClientDefinition,
	server: noteServerDefinition,
};
