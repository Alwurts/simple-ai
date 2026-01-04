import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export const getChatKey = (id: string) => ["chats", id];

export function useGetChat(id: string | null, options?: { enabled?: boolean }) {
	const effectiveId = id ?? "";

	return useQuery({
		queryKey: getChatKey(effectiveId),
		queryFn: async () => {
			const response = await apiClient.api.chat[":chatId"].$get({
				param: { chatId: effectiveId },
			});
			const data = await response.json();
			if (!response.ok) {
				throw new Error("Failed to fetch chat");
			}
			if ("error" in data) {
				throw new Error("No data received");
			}
			return data;
		},
		// Default to true if id exists, but allow overriding via options
		enabled: options?.enabled !== undefined ? options.enabled : !!id,
		// Keep previous data while fetching new data to prevent layout shift
		placeholderData: (previousData) => previousData,
	});
}

export const getAllChatsKey = () => ["chats"];

export function useGetAllChats() {
	return useQuery({
		queryKey: getAllChatsKey(),
		queryFn: async () => {
			const response = await apiClient.api.chat.$get({
				query: { sort: "desc" },
			});
			const data = await response.json();
			return data;
		},
	});
}
