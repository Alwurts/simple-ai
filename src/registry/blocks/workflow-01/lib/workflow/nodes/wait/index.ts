import type { NodeDefinition } from "../types";
import { waitClientDefinition } from "./wait.client";
import { waitServerDefinition } from "./wait.server";
import type { WaitNode } from "./wait.shared";
import { waitSharedDefinition } from "./wait.shared";

export const waitNodeDefinition: NodeDefinition<WaitNode> = {
	shared: waitSharedDefinition,
	client: waitClientDefinition,
	server: waitServerDefinition,
};
