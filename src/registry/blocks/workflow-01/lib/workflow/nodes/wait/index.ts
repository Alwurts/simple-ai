import { waitClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.client";
import { waitServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.server";
import {
	type WaitNode,
	waitSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait/wait.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/types/workflow";

export const waitNodeDefinition: NodeDefinition<WaitNode> = {
	shared: waitSharedDefinition,
	client: waitClientDefinition,
	server: waitServerDefinition,
};
