import type { NodeProcessor } from "@/registry/blocks/flow-01/types/execution";
import type {
	FlowNode,
	GenerateTextNode,
	PromptCrafterNode,
	TextInputNode,
} from "@/registry/blocks/flow-01/types/flow";

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

		const response = await fetch("/api/workflow/flow/generate-text", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tools: generateNode.data.dynamicHandles.tools,
				model: generateNode.data.config.model,
				system,
				prompt,
			}),
		});

		if (!response.ok) {
			throw new Error(`API call failed: ${response.statusText}`);
		}

		const result = await response.json();
		return result.parsedResult;
	},

	"visualize-text": async () => {
		return undefined;
	},
};
