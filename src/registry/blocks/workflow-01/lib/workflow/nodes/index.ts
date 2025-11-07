import { agentNodeDefinition } from "./agent";
import { endNodeDefinition } from "./end";
import { ifElseNodeDefinition } from "./if-else";
import { noteNodeDefinition } from "./note";
import { startNodeDefinition } from "./start";
import { waitNodeDefinition } from "./wait";

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
