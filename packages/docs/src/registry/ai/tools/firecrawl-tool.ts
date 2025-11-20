import { FirecrawlAppV1 as FirecrawlApp } from "@mendable/firecrawl-js";
import { type InferUITool, tool } from "ai";
import { z } from "zod";

const firecrawlParamsSchema = z.object({
	mode: z
		.enum(["search", "scrape"])
		.describe(
			"The operation to perform: 'search' for general queries, 'scrape' for a specific URL",
		),
	query: z
		.string()
		.describe("The search query or the specific URL to scrape"),
});

export type FirecrawlParams = z.infer<typeof firecrawlParamsSchema>;

const firecrawlResultSchema = z.union([
	z.object({
		success: z.literal(true),
		markdown: z.string(),
	}),
	z.object({
		success: z.literal(true),
		documents: z.array(z.any()),
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type FirecrawlResult = z.infer<typeof firecrawlResultSchema>;

export const firecrawlTool = tool({
	name: "firecrawl",
	description:
		"Search the web or scrape a specific URL using Firecrawl. Use this to find live information.",
	inputSchema: firecrawlParamsSchema,
	outputSchema: firecrawlResultSchema,
	execute: async (params) => {
		const apiKey = process.env.FIRECRAWL_API_KEY;

		if (!apiKey) {
			return { success: false, error: "FIRECRAWL_API_KEY is not set" };
		}

		try {
			const app = new FirecrawlApp({ apiKey });

			if (params.mode === "scrape") {
				const scrapeResult = await app.scrapeUrl(params.query, {
					formats: ["markdown"],
				});

				if (!scrapeResult.success) {
					return {
						success: false,
						error: `Failed to scrape: ${scrapeResult.error || "Unknown error"}`,
					};
				}

				return { success: true, markdown: scrapeResult.markdown };
			} else {
				const searchResult = await app.search(params.query, {
					limit: 3,
					scrapeOptions: {
						formats: ["markdown"],
					},
				});

				if (!searchResult.success) {
					return {
						success: false,
						error: `Failed to search: ${searchResult.error || "Unknown error"}`,
					};
				}

				return { success: true, documents: searchResult.data };
			}
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

export type FirecrawlTool = InferUITool<typeof firecrawlTool>;
