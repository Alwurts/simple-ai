"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatContent } from "@/registry/blocks/chat-01/components/chat/chat-content";
import { ChatHeader } from "@/registry/blocks/chat-01/components/chat/chat-header";
import { INITIAL_MESSAGES } from "@/registry/blocks/chat-01/lib/messages";
import type { AIUIMessage } from "@/registry/blocks/chat-01/types/ai-messages";

export function ChatMain() {
	const { messages, sendMessage, status, stop, setMessages } =
		useChat<AIUIMessage>({
			id: "chat-01",
			transport: new DefaultChatTransport({
				api: "/api/ai/chat",
			}),
			messages: INITIAL_MESSAGES,
		});

	return (
		<div className="flex-1 flex flex-col h-full">
			<ChatHeader setMessages={setMessages} />
			<ChatContent
				messages={messages}
				sendMessage={sendMessage}
				status={status}
				stop={stop}
			/>
		</div>
	);
}
