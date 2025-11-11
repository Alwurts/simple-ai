import { agentClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent/agent.client";
import { agentServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent/agent.server";
import {
	type AgentNode,
	agentSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent/agent.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/types/workflow";

export const agentNodeDefinition: NodeDefinition<AgentNode> = {
	shared: agentSharedDefinition,
	client: agentClientDefinition,
	server: agentServerDefinition,
};
