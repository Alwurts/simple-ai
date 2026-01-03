import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	stepCountIs,
	streamText,
} from "ai";
import { createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { generateSystemPrompt } from "../agents/prompt";
import { getAiTools } from "../tools/registry";

export async function agentRespond({
	messages: initialMessages,
	onNewMessage,
	abortSignal,
}: {
	messages: AIUIMessage[];
	onNewMessage: (message: AIUIMessage) => Promise<void>;
	abortSignal: AbortSignal;
}) {
	const stream = createUIMessageStream<AIUIMessage>({
		execute: async ({ writer }) => {
			const startTime = Date.now();

			const finalSystemPrompt = await generateSystemPrompt();
			const tools = getAiTools({ uiStreamWriter: writer });

			const result = streamText({
				model: "openai/gpt-5-mini",
				system: finalSystemPrompt,
				messages: await convertToModelMessages(initialMessages),
				abortSignal,
				tools,
				stopWhen: stepCountIs(25),
				//activeTools: Array.from(activeTools),
				// prepareStep: ({ steps }) => {
				// 	const lastStep = steps[steps.length - 1];
				// 	if (lastStep && lastStep.toolResults.length > 0) {
				// 		for (const result of lastStep.toolResults) {
				// 			if (result.toolName === "load-skill") {
				// 				const output = result.output as LoadSkillResult;
				// 				if (output.success === false) {
				// 					continue;
				// 				}
				// 				const newTools = output.definition.availableTools;
				// 				for (const tool of newTools) {
				// 					activeTools.add(tool as toolId);
				// 				}
				// 			}
				// 		}

				// 		return {
				// 			activeTools: Array.from(activeTools),
				// 		};
				// 	}
				// 	return {};
				// },
			});
			result.consumeStream();

			writer.merge(
				result.toUIMessageStream({
					generateMessageId: () => createId("msg"),
					sendReasoning: true,
					sendSources: true,
					messageMetadata: ({ part }) => {
						if (part.type === "start") {
							return {
								createdAt: new Date(startTime).toISOString(),
								status: "pending",
							};
						}

						if (part.type === "finish") {
							const responseTime = Date.now() - startTime;
							return {
								createdAt: new Date(startTime).toISOString(),
								status: "success",
								usage: part.totalUsage,
								responseTime,
							};
						}
					},
				}),
			);
		},
		generateId: () => createId("msg"),
		originalMessages: initialMessages,
		onFinish: async ({ responseMessage }) => {
			await onNewMessage(responseMessage);
		},
	});

	return createUIMessageStreamResponse({ stream });
}
