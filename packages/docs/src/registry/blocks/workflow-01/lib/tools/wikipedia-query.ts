import { tool } from "ai";
import { z } from "zod";

const wikipediaQueryParamsSchema = z.object({
	action: z
		.enum(["search", "summary"])
		.describe(
			"The action to perform: 'search' for finding articles, 'summary' for getting article content",
		),
	query: z.string().describe("The search query or article title to look up"),
	limit: z
		.number()
		.min(1)
		.max(10)
		.optional()
		.default(5)
		.describe("Maximum number of results to return (for search action)"),
});

export type WikipediaQueryParams = z.infer<typeof wikipediaQueryParamsSchema>;

const wikipediaQuerySearchResultSchema = z.object({
	success: z.literal(true),
	action: z.literal("search"),
	results: z.array(
		z.object({
			title: z.string(),
			pageid: z.number(),
			size: z.number().optional(),
			wordcount: z.number().optional(),
			snippet: z.string().optional(),
			timestamp: z.string().optional(),
		}),
	),
	totalResults: z.number(),
});

const wikipediaQuerySummaryResultSchema = z.object({
	success: z.literal(true),
	action: z.literal("summary"),
	title: z.string(),
	pageid: z.number(),
	extract: z.string(),
	description: z.string().optional(),
	url: z.string(),
	thumbnail: z
		.object({
			source: z.string(),
			width: z.number(),
			height: z.number(),
		})
		.optional(),
});

const wikipediaQueryErrorResultSchema = z.object({
	success: z.literal(false),
	message: z.string(),
});

const wikipediaQueryResultSchema = z.union([
	wikipediaQuerySearchResultSchema,
	wikipediaQuerySummaryResultSchema,
	wikipediaQueryErrorResultSchema,
]);

export type WikipediaQueryResult = z.infer<typeof wikipediaQueryResultSchema>;

export const wikipediaQueryTool = () =>
	tool({
		description:
			"Search Wikipedia articles or get summaries of specific articles. Use 'search' to find articles by topic, and 'summary' to get detailed information about a specific article.",
		inputSchema: wikipediaQueryParamsSchema,
		outputSchema: wikipediaQueryResultSchema,
		execute: async ({
			action,
			query,
			limit,
		}): Promise<WikipediaQueryResult> => {
			try {
				if (action === "search") {
					const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=${limit}&namespace=0&format=json`;

					const response = await fetch(searchUrl);

					if (!response.ok) {
						throw new Error(
							`Wikipedia API error: ${response.status}`,
						);
					}

					const data = await response.json();
					const [, titles, descriptions] = data;

					const results = titles.map(
						(title: string, index: number) => ({
							title,
							pageid: 0,
							snippet: descriptions[index] || "",
						}),
					);

					return {
						success: true,
						action: "search",
						results,
						totalResults: results.length,
					};
				} else if (action === "summary") {
					const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/ /g, "_"))}`;

					const response = await fetch(summaryUrl);

					if (!response.ok) {
						if (response.status === 404) {
							return {
								success: false,
								message: `Article "${query}" not found on Wikipedia. Try using the search action first to find the correct article title.`,
							};
						}
						throw new Error(
							`Wikipedia API error: ${response.status}`,
						);
					}

					const data = await response.json();

					return {
						success: true,
						action: "summary",
						title: data.title,
						pageid: data.pageid,
						extract: data.extract,
						description: data.description,
						url: `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/ /g, "_"))}`,
						thumbnail: data.thumbnail,
					};
				} else {
					throw new Error(`Unsupported action: ${action}`);
				}
			} catch (error) {
				console.error("[wikipediaTool] Error:", error);
				const message =
					error instanceof Error
						? error.message
						: "Unknown error occurred while accessing Wikipedia";
				return {
					success: false,
					message: `Failed to access Wikipedia: ${message}`,
				};
			}
		},
	});
