import type { NodeDefinition } from "../types";
import { agentClientDefinition } from "./agent.client";
import { agentServerDefinition } from "./agent.server";
import type { AgentNode } from "./agent.shared";
import { agentSharedDefinition } from "./agent.shared";

export const agentNodeDefinition: NodeDefinition<AgentNode> = {
	shared: agentSharedDefinition,
	client: agentClientDefinition,
	server: agentServerDefinition,
};
