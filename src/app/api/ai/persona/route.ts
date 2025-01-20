import {
	ProductPersonaSchema,
	UserPersonaSchema,
} from "@/registry/blocks/app-02/types/persona";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamObject } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const { businessName, industry, targetAudience, productDescription } = data;

	const deepSeekClient = createDeepSeek({
		baseURL: process.env.AI_GATEWAY_DEEPSEEK_URL,
	});

	try {
		const result = streamObject({
			model: deepSeekClient("deepseek-chat"),
			system: `
<persona_generation_rules>
  <general_rules>
    - Generate BOTH user and product personas based on the business details provided
    - Use realistic but fictional details
    - Include relevant emojis in appropriate fields
    - Ensure personas are aligned with the business context
    - Make the personas complementary - the user persona should be an ideal customer for the product persona
  </general_rules>

</persona_generation_rules>`,
			prompt: `Business Name: ${businessName}
			Industry: ${industry}
			Target Audience: ${targetAudience}
			Product Description: ${productDescription}`,
			schema: z.object({
				userPersona: UserPersonaSchema,
				productPersona: ProductPersonaSchema,
			}),
		});

		return result.toTextStreamResponse();
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
