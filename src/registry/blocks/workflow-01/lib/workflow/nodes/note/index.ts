import type { NodeDefinition } from "../types";
import { noteClientDefinition } from "./note.client";
import { noteServerDefinition } from "./note.server";
import type { NoteNode } from "./note.shared";
import { noteSharedDefinition } from "./note.shared";

export const noteNodeDefinition: NodeDefinition<NoteNode> = {
	shared: noteSharedDefinition,
	client: noteClientDefinition,
	server: noteServerDefinition,
};
