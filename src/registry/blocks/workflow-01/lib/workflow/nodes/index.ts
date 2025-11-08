import { agentNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/agent";
import { endNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/end";
import { ifElseNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/if-else";
import { noteNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/note";
import { startNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/start";
import { waitNodeDefinition } from "@/registry/blocks/workflow-01/lib/workflow/nodes/wait";

const nodeDefinitions = {
	agent: agentNodeDefinition,
	"if-else": ifElseNodeDefinition,
	start: startNodeDefinition,
	end: endNodeDefinition,
	note: noteNodeDefinition,
	wait: waitNodeDefinition,
} as const;

export const nodeRegistry = nodeDefinitions;

type NodeMap = {
	[K in keyof typeof nodeRegistry]: ReturnType<
		(typeof nodeRegistry)[K]["client"]["create"]
	>;
};

export type FlowNode = NodeMap[keyof NodeMap];
export type FlowNodeType = FlowNode["type"];

export type AnyNodeDefinition =
	(typeof nodeRegistry)[keyof typeof nodeRegistry];

export function getNodeDefinition<T extends FlowNodeType>(
	type: T,
): (typeof nodeRegistry)[T] {
	return nodeRegistry[type];
}

export function getAllNodeDefinitions(): AnyNodeDefinition[] {
	return Object.values(nodeRegistry);
}
