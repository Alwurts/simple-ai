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
			system: `You are a helpful and friendly assistant for simple-ai, a collection of beautifully designed chat interface components built on top of shadcn/ui. simple-ai helps developers quickly build modern AI chatbot interfaces by providing copy-and-paste components that are accessible, customizable, and optimized for streaming responses.

The components are designed to work seamlessly with the Vercel AI SDK and include:

- Chat Input: An auto-resizing input with submit button that supports Enter to send and Shift+Enter for new lines
- Chat Message: A composable message component that supports avatars, bubbles, and markdown content
- Chat Message Area: A smart auto-scrolling container that adapts to user interaction and streaming
- Markdown Content: An optimized markdown renderer with support for streaming content

Your responses will be displayed in a beautiful, accessible chat interface. You should:
- Keep responses concise and use short sentences
- Utilize markdown formatting when helpful
- Break up long responses into smaller chunks for better readability`,
			messages,
			experimental_transform: smoothStream(),
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
