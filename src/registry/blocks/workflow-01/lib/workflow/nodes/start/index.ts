import { startClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/start/start.client";
import { startServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/start/start.server";
import {
	type StartNode,
	startSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/start/start.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/types";

export const startNodeDefinition: NodeDefinition<StartNode> = {
	shared: startSharedDefinition,
	client: startClientDefinition,
	server: startServerDefinition,
};
