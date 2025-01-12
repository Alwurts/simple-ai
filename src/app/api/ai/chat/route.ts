import { createGroq } from "@ai-sdk/groq";
import { smoothStream, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const groqClient = createGroq({
		baseURL: process.env.AI_GATEWAY_GROQ_URL,
	});

	try {
		const result = streamText({
			model: groqClient("llama-3.1-8b-instant"),
			system:
				"You are a helpful and very friendly assistant, and always answer with short sentences, never use long paragraphs, do not explain yourself, just answer the question",
			messages,
			experimental_transform: smoothStream(),
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
