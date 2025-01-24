import type { ApiResponse, Model } from "@/registry/blocks/flow-01/types/ai";
import type { GenerateTextNode } from "@/registry/blocks/flow-01/types/flow";

const MOCK_AI_RESPONSE = process.env.MOCK_AI_RESPONSE === "true";

export async function generateText({
	model,
	system,
	prompt,
	tools,
}: {
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
	model: Model;
	system?: string;
	prompt: string;
}): Promise<ApiResponse> {
	if (MOCK_AI_RESPONSE) {
		return mockGenerateText({ model, system, prompt, tools });
	}

	const response = await fetch("/api/ai/flow/generate-text", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			system,
			prompt,
			model,
			tools,
		}),
	});

	if (!response.ok) {
		throw new Error(`API call failed: ${response.statusText}`);
	}

	const data = await response.json();

	return data;
}

function mockGenerateText({
	model,
	system,
	prompt,
	tools,
}: {
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
	model: Model;
	system?: string;
	prompt: string;
}): ApiResponse {
	return {
		text: `Using model ${model} to generate text with system: \n${system}\n and prompt: \n${prompt}\n`,
		totalTokens: 100,
		toolResults: tools.map((tool) => ({
			id: tool.id,
			name: tool.name,
			result: `Tool ${tool.name} result`,
		})),
	};
}
