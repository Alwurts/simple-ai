"use client";

import { Provider, useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { memo } from "react";
import { ChatContent } from "@/components/chat/chat-content";
import type { AIUIMessage } from "@/types/ai";

function ChatMainInternal({ id }: { id: string }) {
	useChat<AIUIMessage>({
		id,
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});

	return (
		<div className="@container flex h-full min-w-0 max-w-screen flex-col bg-background">
			<ChatContent />
		</div>
	);
}

function ChatMainWithProvider({ id }: { id: string }) {
	return (
		<Provider key={id}>
			<ChatMainInternal id={id} />
		</Provider>
	);
}

export const ChatMain = memo(ChatMainWithProvider);
