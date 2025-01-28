import type { FlowNode } from "@/registry/lib/flow/workflow";
import type { GenerateTextNode } from "@/registry/ui/flow/generate-text-node";
import type { PromptCrafterNode } from "@/registry/ui/flow/prompt-crafter-node";
import type { TextInputNode } from "@/registry/ui/flow/text-input-node";
import type { VisualizeTextNode } from "@/registry/ui/flow/visualize-text-node";
import { nanoid } from "nanoid";

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
		width: 350,
		height: 300,
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
		width: 350,
		height: 300,
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
