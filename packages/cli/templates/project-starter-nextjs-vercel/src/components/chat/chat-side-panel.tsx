"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { AppLayoutHeader } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { useChatClientLogic } from "@/hooks/use-chat-client-logic";
import { ChatHistory } from "./chat-history";
import { ChatInterface } from "./chat-interface";

export function ChatSidePanel() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const chatIdParam = searchParams.get("chatId");

	const { id, isLoading, messages, onNewChatCreated } = useChatClientLogic({
		chatId: chatIdParam,
	});

	const handleNewChat = useCallback(
		(newChatId: string) => {
			onNewChatCreated(newChatId);
			const params = new URLSearchParams(searchParams.toString());
			params.set("chatId", newChatId);
			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams, onNewChatCreated],
	);

	const handleClearChat = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("chatId");
		router.replace(`${pathname}?${params.toString()}`);
	}, [pathname, router, searchParams]);

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center text-muted-foreground">
				Loading chat...
			</div>
		);
	}

	return (
		<>
			<AppLayoutHeader>
				<span className="truncate font-mono text-xs text-muted-foreground">{id}</span>
				<div className="ml-auto flex items-center gap-1">
					<ChatHistory
						onNavigate={(chatId) => {
							const params = new URLSearchParams(searchParams.toString());
							params.set("chatId", chatId);
							router.replace(`${pathname}?${params.toString()}`);
						}}
						currentChatId={id}
					/>
					<Button variant="ghost" size="icon" onClick={handleClearChat}>
						<Plus className="size-4" />
						<span className="sr-only">New Chat</span>
					</Button>
				</div>
			</AppLayoutHeader>

			<ChatInterface key={id} id={id} initialMessages={messages} onNewChat={handleNewChat} />
		</>
	);
}
