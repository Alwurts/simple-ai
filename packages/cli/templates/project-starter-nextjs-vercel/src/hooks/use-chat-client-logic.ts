"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { getChatKey, useGetChat } from "@/hooks/query/use-chat";
import { createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";

interface UseChatClientLogicProps {
	chatId: string | null | undefined;
}

export function useChatClientLogic({ chatId }: UseChatClientLogicProps) {
	const queryClient = useQueryClient();

	const { id, isNew } = useMemo(() => {
		if (chatId) {
			return { id: chatId, isNew: false };
		}
		return { id: createId("chat"), isNew: true };
	}, [chatId]);

	const { data: chatData, isLoading } = useGetChat(id, {
		enabled: !isNew,
	});

	const onNewChatCreated = (newChatId: string) => {
		// Seed the cache with a placeholder so React Query finds data immediately
		// and doesn't trigger a "Loading..." state when the URL updates.
		queryClient.setQueryData(getChatKey(newChatId), {
			id: newChatId,
			messages: [],
			userId: "current-user", // Placeholder
			title: "New Chat",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	};

	return {
		id,
		isNew,
		messages: isNew ? [] : ((chatData?.messages as AIUIMessage[]) ?? []),
		isLoading: !isNew && isLoading,
		onNewChatCreated,
	};
}
