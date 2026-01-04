import { z } from "zod";

export const searchMetadataSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("product"),
		id: z.string(),
		title: z.string(),
		sku: z.string(),
	}),
	z.object({
		type: z.literal("warehouse"),
		id: z.string(),
		title: z.string(),
		location: z.string().nullable(),
	}),
]);

export const searchResultSchema = z.object({
	path: z.string(),
	snippet: z.string(),
	score: z.number(),
	metadata: searchMetadataSchema,
});

export const searchResponseSchema = z.object({
	results: z.array(searchResultSchema),
});

export type SearchMetadata = z.infer<typeof searchMetadataSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
