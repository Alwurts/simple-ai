"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useGetChat } from "@/hooks/query/use-chat";
import { createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { AppLayoutHeader } from "../layout/app-layout";
import { Button } from "../ui/button";
import { ChatInputArea } from "./parts/chat-input-area";
import { Chat } from "./parts/chat-layout";
import { ChatMessages } from "./parts/chat-messages";

export function ChatSidePanel() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const chatId = searchParams.get("chatId");

	const handleNewChat = useCallback(
		(newChatId: string) => {
			const params = new URLSearchParams(searchParams.toString());
			console.log("newChatId", newChatId);
			params.set("chatId", newChatId);

			const newParams = params.toString();
			router.replace(`${pathname}?${newParams}`);
		},
		[pathname, router, searchParams],
	);

	const handleRemoveChatId = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("chatId");
		return params.toString();
	}, [searchParams]);

	const effectiveChatId = useMemo(() => {
		return chatId || createId("chat");
	}, [chatId]);

	const { data: chatData, isLoading: isLoadingChat } = useGetChat(chatId);

	const chatMessagesLoaded = chatData?.messages as AIUIMessage[] | undefined;

	if (isLoadingChat) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<AppLayoutHeader>
				<span>{chatId}</span>
				<Button variant="outline" size="icon" className="ml-auto" asChild>
					<Link href={`${pathname}?${handleRemoveChatId()}`}>
						<Plus />
						<span className="sr-only">New Chat</span>
					</Link>
				</Button>
			</AppLayoutHeader>
			<Chat
				id={effectiveChatId}
				initialMessages={chatMessagesLoaded ?? []}
				onNewChat={handleNewChat}
			>
				<ChatMessages />
				<ChatInputArea />
			</Chat>
		</>
	);
}
