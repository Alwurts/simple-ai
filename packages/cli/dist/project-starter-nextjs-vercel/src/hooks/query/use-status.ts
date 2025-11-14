import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const getStatusKey = () => ["status"];

export function useStatus() {
	return useQuery({
		queryKey: getStatusKey(),
		queryFn: async () => {
			const response = await apiClient.api.status.$get();
			if (!response.ok) {
				throw new Error("Failed to fetch status");
			}
			return response.json();
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
