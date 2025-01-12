import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";

export async function POST(req: Request) {
	const { messages } = await req.json();

	try {
		const result = streamText({
			model: openai("gpt-4o-mini"),
			system: "You are a helpful assistant",
			messages,
			experimental_transform: smoothStream(),
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
