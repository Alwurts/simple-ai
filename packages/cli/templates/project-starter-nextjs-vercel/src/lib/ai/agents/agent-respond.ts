import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { generateSystemPrompt } from "../agents/prompt";
import type { LoadSkillResult } from "../tools/(registry)/load-skill";
import { type aiToolId, getAiTools } from "../tools/registry";

export async function agentRespond({
	messages: initialMessages,
	onUpsertMessage,
	abortSignal,
	userId,
}: {
	messages: AIUIMessage[];
	onUpsertMessage: (message: AIUIMessage) => Promise<void>;
	abortSignal: AbortSignal;
	userId: string;
}) {
	const startTime = Date.now();

	const finalSystemPrompt = await generateSystemPrompt();

	// Create user-scoped tools
	const tools = getAiTools(userId);

	const activeTools: Set<aiToolId> = new Set(["load-skill"]);

	// If we loaded a skill in the past, we need to add its tools to the active tools
	for (const message of initialMessages) {
		for (const part of message.parts) {
			if (
				part.type === "tool-load-skill" &&
				part.state === "output-available" &&
				part.output.definition
			) {
				part.output.definition.availableTools.forEach((tool) => {
					activeTools.add(tool as aiToolId);
				});
			}
		}
	}

	const streamResult = streamText({
		model: "openai/gpt-5-nano",
		system: finalSystemPrompt,
		messages: await convertToModelMessages(initialMessages),
		abortSignal,
		tools: tools,
		stopWhen: stepCountIs(25),
		activeTools: Array.from(activeTools),
		prepareStep: ({ steps }) => {
			const lastStep = steps[steps.length - 1];
			if (lastStep && lastStep.toolResults.length > 0) {
				for (const result of lastStep.toolResults) {
					if (result.toolName === "load-skill") {
						const output = result.output as LoadSkillResult;
						if (output.success === false) {
							continue;
						}
						const newTools = output.definition.availableTools;
						for (const tool of newTools) {
							activeTools.add(tool as aiToolId);
						}
					}
				}

				return {
					activeTools: Array.from(activeTools),
				};
			}
			return {};
		},
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
