import { nanoid } from "nanoid";
import type {
	FlowNode,
	GenerateTextNode,
	PromptCrafterNode,
	TextInputNode,
	VisualizeTextNode,
} from "@/registry/blocks/flow-01/types/flow";

export type NodePosition = {
	x: number;
	y: number;
};

export const nodeFactory = {
	"generate-text": (position: NodePosition): GenerateTextNode => ({
		id: nanoid(),
		type: "generate-text",
		position,
		data: {
			config: {
				model: "llama-3.1-8b-instant",
			},
			dynamicHandles: {
				tools: [],
			},
		},
	}),

	"prompt-crafter": (position: NodePosition): PromptCrafterNode => ({
		id: nanoid(),
		type: "prompt-crafter",
		position,
		data: {
			config: {
				template: "",
			},
			dynamicHandles: {
				"template-tags": [],
			},
		},
	}),

	"visualize-text": (position: NodePosition): VisualizeTextNode => ({
		id: nanoid(),
		type: "visualize-text",
		position,
		data: {},
	}),

	"text-input": (position: NodePosition): TextInputNode => ({
		id: nanoid(),
		type: "text-input",
		position,
		data: {
			config: {
				value: "",
			},
		},
	}),
};

export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
): FlowNode {
	const factory = nodeFactory[nodeType];
	if (!factory) {
		throw new Error(`Unknown node type: ${nodeType}`);
	}
	return factory(position);
}
