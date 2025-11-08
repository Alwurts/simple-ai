import type { NodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/types";
import { waitClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.client";
import { waitServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.server";
import {
	type WaitNode,
	waitSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.shared";

export const waitNodeDefinition: NodeDefinition<WaitNode> = {
	shared: waitSharedDefinition,
	client: waitClientDefinition,
	server: waitServerDefinition,
};
