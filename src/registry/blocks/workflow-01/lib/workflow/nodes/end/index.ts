import { endClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/end/end.client";
import { endServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/end/end.server";
import {
	type EndNode,
	endSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/end/end.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/types";

export const endNodeDefinition: NodeDefinition<EndNode> = {
	shared: endSharedDefinition,
	client: endClientDefinition,
	server: endServerDefinition,
};
