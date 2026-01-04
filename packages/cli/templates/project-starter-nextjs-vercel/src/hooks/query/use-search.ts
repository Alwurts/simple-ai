import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { SearchResponse } from "@/types/search";

export function useSearch(query: string) {
	return useQuery<SearchResponse>({
		queryKey: ["search", query],
		queryFn: async () => {
			if (!query) {
				return { results: [] };
			}
			const response = await apiClient.api.inventory.search.$get({ query: { q: query } });
			if (!response.ok) {
				throw new Error("Search failed");
			}
			return response.json();
		},
		enabled: query.length > 0,
	});
}
