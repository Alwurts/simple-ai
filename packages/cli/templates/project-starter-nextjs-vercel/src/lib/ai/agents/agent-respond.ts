import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { generateSystemPrompt } from "../agents/prompt";
import { aiTools } from "../tools/registry";

export async function agentRespond({
	messages: initialMessages,
	onUpsertMessage,
	abortSignal,
}: {
	messages: AIUIMessage[];
	onUpsertMessage: (message: AIUIMessage) => Promise<void>;
	abortSignal: AbortSignal;
}) {
	const startTime = Date.now();

	const finalSystemPrompt = await generateSystemPrompt();
	const tools = aiTools;

	const streamResult = streamText({
		model: "openai/gpt-5-nano",
		system: finalSystemPrompt,
		messages: await convertToModelMessages(initialMessages),
		abortSignal,
		tools,
		stopWhen: stepCountIs(25),
	});

	return streamResult.toUIMessageStreamResponse<AIUIMessage>({
		originalMessages: initialMessages,
		generateMessageId: () => createId("msg"),
		onFinish: async ({ responseMessage }) => {
			await onUpsertMessage(responseMessage);
		},
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
	});
}
