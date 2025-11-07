import type { NodeDefinition } from "../types";
import { ifElseClientDefinition } from "./if-else.client";
import { ifElseServerDefinition } from "./if-else.server";
import type { IfElseNode } from "./if-else.shared";
import { ifElseSharedDefinition } from "./if-else.shared";

export const ifElseNodeDefinition: NodeDefinition<IfElseNode> = {
	shared: ifElseSharedDefinition,
	client: ifElseClientDefinition,
	server: ifElseServerDefinition,
};
