import type {
	FlowNode,
	GenerateTextNode,
	PromptCrafterNode,
	TextInputNode,
} from "@/registry/blocks/flow-01/types/flow";
import { generateText } from "@/registry/blocks/flow-01/lib/ai";

export type NodeProcessor = (
	node: FlowNode,
	targetsData: Record<string, string> | undefined,
) => Promise<Record<string, string> | undefined>;

export const nodeProcessors: Record<FlowNode["type"], NodeProcessor> = {
	"text-input": async (node) => {
		const textNode = node as TextInputNode;
		return {
			result: textNode.data.config.value,
		};
	},

	"prompt-crafter": async (node, targetsData) => {
		const promptNode = node as PromptCrafterNode;
		if (!targetsData) {
			throw new Error("Targets data not found");
		}

		let parsedTemplate = promptNode.data.config.template;
		for (const [targetId, targetValue] of Object.entries(targetsData)) {
			const tag = promptNode.data.dynamicHandles["template-tags"].find(
				(handle) => handle.id === targetId,
			);
			if (!tag) {
				throw new Error(`Tag with id ${targetId} not found`);
			}
			parsedTemplate = parsedTemplate.replaceAll(
				`{{${tag.name}}}`,
				targetValue,
			);
		}
		return {
			result: parsedTemplate,
		};
	},

	"generate-text": async (node, targetsData) => {
		const generateNode = node as GenerateTextNode;
		const system = targetsData?.system;
		const prompt = targetsData?.prompt;
		if (!prompt) {
			throw new Error("Prompt not found");
		}

		const result = await generateText({
			tools: generateNode.data.dynamicHandles.tools,
			model: generateNode.data.config.model,
			system,
			prompt,
		});

		const parsedResult: Record<string, string> = {
			result: result.text,
		};
		if (result.toolResults) {
			for (const toolResult of result.toolResults) {
				parsedResult[toolResult.id] = toolResult.result;
			}
		}

		return parsedResult;
	},

	"visualize-text": async () => {
		return undefined;
	},
};
