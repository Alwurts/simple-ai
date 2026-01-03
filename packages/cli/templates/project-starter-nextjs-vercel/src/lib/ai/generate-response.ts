import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	stepCountIs,
	streamText,
} from "ai";
import type { AIUIMessage } from "@/types/ai";
import { getAgentSystemPrompt } from "./prompts/agent-prompt";
import { getAgentTools } from "./tools";

export function generateResponse({ messages, cwd }: { messages: AIUIMessage[]; cwd: string }) {
	const stream = createUIMessageStream<AIUIMessage>({
		execute: async ({ writer }) => {
			const result = streamText({
				model: "openai/gpt-5-mini",
				system: getAgentSystemPrompt(),
				messages: await convertToModelMessages(messages),
				tools: getAgentTools({ uiStreamWriter: writer, cwd }),
				stopWhen: stepCountIs(10),
				maxRetries: 10,
			});
			result.consumeStream();

			writer.merge(result.toUIMessageStream());
		},
		originalMessages: messages,
		onFinish: async ({ responseMessage }) => {
			console.log("onFinish responseMessage", responseMessage);
		},
	});

	return createUIMessageStreamResponse({ stream });
}
