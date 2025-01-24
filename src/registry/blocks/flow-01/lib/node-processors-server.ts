import type {
	FlowNode,
	GenerateTextNode,
	PromptCrafterNode,
	TextInputNode,
} from "@/registry/blocks/flow-01/types/flow";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

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

		let client:
			| ReturnType<typeof createDeepSeek>
			| ReturnType<typeof createGroq>;
		switch (generateNode.data.config.model) {
			case "deepseek-chat":
				client = createDeepSeek({
					baseURL: process.env.AI_GATEWAY_DEEPSEEK_URL,
				});
				break;
			case "llama-3.3-70b-versatile":
			case "llama-3.1-8b-instant":
				client = createGroq({
					baseURL: process.env.AI_GATEWAY_GROQ_URL,
				});
				break;
			default:
				throw new Error(`Unsupported model: ${generateNode.data.config.model}`);
		}

		// Map tools to the format expected by the AI SDK
		const mappedTools = Object.fromEntries(
			generateNode.data.dynamicHandles.tools.map((toolToMap) => [
				toolToMap.name,
				{
					description: toolToMap.description,
					parameters: z.object({
						toolValue: z.string(),
					}),
					execute: async ({ toolValue }: { toolValue: string }) => toolValue,
				},
			]),
		);

		const result = await generateText({
			model: client(generateNode.data.config.model),
			system,
			prompt,
			...(generateNode.data.dynamicHandles.tools.length > 0 && {
				tools: mappedTools,
				maxSteps: 1,
				toolChoice: "required",
			}),
		});

		const parsedResult: Record<string, string> = {
			result: result.text,
		};

		if (result.toolResults) {
			for (const toolResult of result.toolResults) {
				const originalTool = generateNode.data.dynamicHandles.tools.find(
					(tool) => tool.name === toolResult.toolName,
				);
				if (originalTool) {
					parsedResult[originalTool.id] = toolResult.result;
				}
			}
		}

		return parsedResult;
	},

	"visualize-text": async () => {
		return undefined;
	},
};
