import { ifElseClientDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else/if-else.client";
import { ifElseServerDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else/if-else.server";
import {
	type IfElseNode,
	ifElseSharedDefinition,
} from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else/if-else.shared";
import type { NodeDefinition } from "@/registry/blocks/workflow-01/types/workflow";

export const ifElseNodeDefinition: NodeDefinition<IfElseNode> = {
	shared: ifElseSharedDefinition,
	client: ifElseClientDefinition,
	server: ifElseServerDefinition,
};
