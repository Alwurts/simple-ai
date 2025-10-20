import { streamObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/models";
import {
	ProductPersonaSchema,
	UserPersonaSchema,
} from "@/registry/blocks/app-02/lib/persona";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const data = await req.json();
	const { businessName, industry, targetAudience, productDescription } = data;
	try {
		const result = streamObject({
			model: model.languageModel("gpt-5-nano"),
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
