import { agentNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent";
import { endNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/end";
import { ifElseNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else";
import { noteNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/note";
import { startNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/start";
import { waitNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait";
import type {
	AnyNodeDefinition,
	FlowNodeType,
} from "@/registry/blocks/workflow-01/types/workflow";

const nodeDefinitions = {
	agent: agentNodeDefinition,
	"if-else": ifElseNodeDefinition,
	start: startNodeDefinition,
	end: endNodeDefinition,
	note: noteNodeDefinition,
	wait: waitNodeDefinition,
} as const;

export const nodeRegistry = nodeDefinitions;

export function getNodeDefinition<T extends FlowNodeType>(
	type: T,
): (typeof nodeRegistry)[T] {
	return nodeRegistry[type];
}

export function getAllNodeDefinitions(): AnyNodeDefinition[] {
	return Object.values(nodeRegistry);
}
