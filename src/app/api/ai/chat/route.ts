import { groq } from "@ai-sdk/groq";
import { smoothStream, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	try {
		const result = streamText({
			model: groq("llama-3.1-8b-instant"),
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
