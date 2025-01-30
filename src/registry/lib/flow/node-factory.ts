import type { FlowNode } from "@/registry/lib/flow/workflow";
import type { GenerateTextNodeController } from "@/registry/ui/flow/generate-text-node-controller";
import type { PromptCrafterNodeController } from "@/registry/ui/flow/prompt-crafter-node-controller";
import type { TextInputNodeController } from "@/registry/ui/flow/text-input-node-controller";
import type { VisualizeTextNodeController } from "@/registry/ui/flow/visualize-text-node-controller";
import { nanoid } from "nanoid";

export type NodePosition = {
	x: number;
	y: number;
};

export const nodeFactory = {
	"generate-text": (position: NodePosition): GenerateTextNodeController => ({
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

	"prompt-crafter": (position: NodePosition): PromptCrafterNodeController => ({
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

	"visualize-text": (position: NodePosition): VisualizeTextNodeController => ({
		id: nanoid(),
		type: "visualize-text",
		position,
		data: {},
		width: 350,
		height: 300,
	}),

	"text-input": (position: NodePosition): TextInputNodeController => ({
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
	if (!nodeType) {
		throw new Error("Node type is required");
	}
	const factory = nodeFactory[nodeType];
	if (!factory) {
		throw new Error(`Unknown node type: ${nodeType}`);
	}
	return factory(position);
}
