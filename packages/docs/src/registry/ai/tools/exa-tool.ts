import { type InferUITool, tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";

const exaParamsSchema = z.object({
	query: z.string().describe("The search query or URL to process"),
	mode: z
		.enum(["search", "retrieve", "find-similar"])
		.describe(
			"The mode of operation: 'search' for general queries, 'retrieve' to get content of a specific URL, 'find-similar' to find websites similar to a URL",
		),
	numResults: z
		.number()
		.min(1)
		.max(5)
		.optional()
		.default(2)
		.describe("Number of results to return (default: 2)"),
});

export type ExaParams = z.infer<typeof exaParamsSchema>;

const exaResultSchema = z.union([
	z.object({
		success: z.literal(true),
		data: z.any(),
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type ExaResult = z.infer<typeof exaResultSchema>;

export const exaTool = tool({
	name: "exa",
	description:
		"Search the web, retrieve content, or find similar pages using Exa. Ideal for AI-powered research.",
	inputSchema: exaParamsSchema,
	outputSchema: exaResultSchema,
	execute: async ({ query, mode, numResults }) => {
		const apiKey = process.env.EXA_API_KEY;

		if (!apiKey) {
			return { success: false, error: "EXA_API_KEY is not set" };
		}

		try {
			const exa = new Exa(apiKey);

			let result: unknown;

			if (mode === "search") {
				// "auto" type uses Exa's decision logic to switch between keyword and neural search
				result = await exa.search(query, {
					type: "auto",
					numResults,
				});
			} else if (mode === "retrieve") {
				// Get content for specific URLs
				result = await exa.getContents([query], {
					text: true,
				});
			} else if (mode === "find-similar") {
				// Find pages similar to a given URL
				result = await exa.findSimilar(query, {
					numResults,
				});
			} else {
				return { success: false, error: "Invalid mode" };
			}

			return { success: true, data: result };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Unknown error occurred",
			};
		}
	},
});

export type ExaTool = InferUITool<typeof exaTool>;
