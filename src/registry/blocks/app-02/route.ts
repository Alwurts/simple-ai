// src/registry/blocks/persona-generator/route.ts
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import {
	UserPersonaSchema,
	ProductPersonaSchema,
} from "@/registry/blocks/app-02/types/persona";

export async function POST(req: Request) {
	const { businessName, industry, targetAudience, productDescription } =
		await req.json();

	const result = streamObject({
		model: openai("gpt-4-turbo"),
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
}
