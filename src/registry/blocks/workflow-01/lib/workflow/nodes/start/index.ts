import type { NodeDefinition } from "../types";
import { startClientDefinition } from "./start.client";
import { startServerDefinition } from "./start.server";
import type { StartNode } from "./start.shared";
import { startSharedDefinition } from "./start.shared";

export const startNodeDefinition: NodeDefinition<StartNode> = {
	shared: startSharedDefinition,
	client: startClientDefinition,
	server: startServerDefinition,
};
