import type { NodeDefinition } from "../types";
import { endClientDefinition } from "./end.client";
import { endServerDefinition } from "./end.server";
import type { EndNode } from "./end.shared";
import { endSharedDefinition } from "./end.shared";

export const endNodeDefinition: NodeDefinition<EndNode> = {
	shared: endSharedDefinition,
	client: endClientDefinition,
	server: endServerDefinition,
};
