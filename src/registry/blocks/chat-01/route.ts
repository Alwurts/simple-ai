import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		model: openai("gpt-5-nano"),
		system: "You are a helpful assistant",
		messages: convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
