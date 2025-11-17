import { type InferUITool, tool } from "ai";
import { z } from "zod";

const webSearchParamsSchema = z.object({
	query: z.string().describe("The search query to perform"),
	limit: z
		.number()
		.optional()
		.default(5)
		.describe("Maximum number of results to return"),
});

export type WebSearchParams = z.infer<typeof webSearchParamsSchema>;

const webSearchResultSchema = z.union([
	z.object({
		success: z.literal(true),
		results: z.array(
			z.object({
				title: z.string(),
				url: z.string(),
				snippet: z.string(),
			}),
		),
	}),
	z.object({
		success: z.literal(false),
		error: z.string(),
	}),
]);

export type WebSearchResult = z.infer<typeof webSearchResultSchema>;

export const webSearchTool = tool({
	name: "web-search",
	description: "Search the web for information",
	inputSchema: webSearchParamsSchema,
	outputSchema: webSearchResultSchema,
	execute: async (params) => {
		// Mock implementation - returns fake search results
		const mockResults = [
			{
				title: "Example Result 1",
				url: "https://example.com/result1",
				snippet: `This is a mock search result for "${params.query}". This would contain relevant information from the web.`,
			},
			{
				title: "Example Result 2",
				url: "https://example.com/result2",
				snippet: `Another mock result showing how web search results would appear for the query "${params.query}".`,
			},
			{
				title: "Example Result 3",
				url: "https://example.com/result3",
				snippet: `A third example result demonstrating the format of web search responses for "${params.query}".`,
			},
		];

		const limitedResults = mockResults.slice(0, params.limit || 5);

		return {
			success: true,
			results: limitedResults,
		};
	},
});

export type WebSearchTool = InferUITool<typeof webSearchTool>;
