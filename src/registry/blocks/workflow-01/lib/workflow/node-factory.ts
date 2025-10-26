import { nanoid } from "nanoid";
import type { AgentNode } from "@/registry/blocks/workflow-01/components/workflow/agent-node";
import type { EndNode } from "@/registry/blocks/workflow-01/components/workflow/end-node";
import type { IfElseNode } from "@/registry/blocks/workflow-01/components/workflow/if-else-node";
import type { NoteNode } from "@/registry/blocks/workflow-01/components/workflow/note-node";
import type { StartNode } from "@/registry/blocks/workflow-01/components/workflow/start-node";
import type { FlowNode } from "@/registry/blocks/workflow-01/lib/workflow/types";

type NodePosition = {
	x: number;
	y: number;
};

/**
 * Create a start node
 * - No incoming connections
 * - Max 1 outgoing connection
 */
export function createStartNode(position: NodePosition): StartNode {
	return {
		id: nanoid(),
		type: "start",
		position,
		deletable: false,
		data: {
			sourceType: { type: "text" },
		},
	};
}

/**
 * Create an agent node
 * - Accepts input from one source
 * - Routes to one output
 */
export function createAgentNode(position: NodePosition): AgentNode {
	return {
		id: nanoid(),
		type: "agent",
		position,
		data: {
			name: "Agent",
			status: "idle",
			model: "gpt-5-nano",
			systemPrompt: "",
			selectedTools: [],
			sourceType: { type: "text" },
			hideResponseInChat: false,
			excludeFromConversation: false,
			maxSteps: 5,
		},
	};
}

/**
 * Create an if-else node
 * - Routes to different outputs based on conditions
 * - Supports multiple dynamic condition branches
 */
export function createIfElseNode(position: NodePosition): IfElseNode {
	return {
		id: nanoid(),
		type: "if-else",
		position,
		data: {
			status: "idle",
			dynamicSourceHandles: [
				{
					id: nanoid(),
					label: "If",
					condition: "",
				},
			],
		},
	};
}

/**
 * Create an end node
 * - Terminal node that ends workflow execution
 * - No outgoing connections
 */
export function createEndNode(position: NodePosition): EndNode {
	return {
		id: nanoid(),
		type: "end",
		position,
		data: {},
	};
}

/**
 * Create a note node
 * - Resizable node that contains text content
 * - Can be connected to organize workflows
 */
export function createNoteNode(position: NodePosition): NoteNode {
	return {
		id: nanoid(),
		type: "note",
		position,
		data: {
			content: "",
		},
	};
}

/**
 * Node factory registry - maps node types to their creation functions
 */
const nodeFactoryRegistry: Record<
	FlowNode["type"],
	(position: NodePosition) => FlowNode
> = {
	start: createStartNode,
	agent: createAgentNode,
	"if-else": createIfElseNode,
	end: createEndNode,
	note: createNoteNode,
};

/**
 * Create a node of the specified type at the given position
 */
export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
): FlowNode {
	if (!nodeType) {
		throw new Error("Node type is required");
	}
	const factory = nodeFactoryRegistry[nodeType];
	if (!factory) {
		throw new Error(`Unknown node type: ${nodeType}`);
	}
	return factory(position);
}
