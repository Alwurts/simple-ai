/* import { createDeepSeek } from "@ai-sdk/deepseek"; */
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const { prompt, system }: { prompt: string; system: string } = data;

	/* const deepSeekClient = createDeepSeek({
		baseURL: process.env.AI_GATEWAY_DEEPSEEK_URL,
	}); */

	console.log("prompt", { prompt, system });

	const groqClient = createGroq({
		baseURL: process.env.AI_GATEWAY_GROQ_URL,
	});

	try {
		const result = await generateText({
			model: groqClient("llama-3.1-8b-instant"),
			system: system,
			prompt: prompt,
		});
		throw new Error("Mock error");

		return NextResponse.json(result);
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
