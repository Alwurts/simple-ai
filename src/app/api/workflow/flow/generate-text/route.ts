import { generateAIText } from "@/registry/blocks/flow-01/lib/server/generate-ai-text";
import type { Model } from "@/registry/blocks/flow-01/types/ai";
import type { GenerateTextNode } from "@/registry/blocks/flow-01/types/flow";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const {
		prompt,
		system,
		model,
		tools,
	}: {
		prompt: string;
		system: string;
		model: Model;
		tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
	} = data;

	try {
		const result = await generateAIText({
			prompt,
			system,
			model,
			tools,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
