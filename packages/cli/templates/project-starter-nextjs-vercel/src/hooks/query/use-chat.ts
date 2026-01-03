import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const getChatKey = (id: string) => ["chats", id];

export function useGetChat(id: string | null) {
	const effectiveId = id ?? "";
	return useQuery({
		queryKey: getChatKey(effectiveId),
		queryFn: async () => {
			const response = await apiClient.api.chat[":chatId"].$get({
				param: { chatId: effectiveId },
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch item");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
		enabled: !!id,
	});
}
