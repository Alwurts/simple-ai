"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { AIUIMessage } from "@/registry/ai/messages";
import { ChatContent } from "@/registry/blocks/chat-04/components/chat/chat-content";
import { ChatHeader } from "@/registry/blocks/chat-04/components/chat/chat-header";

export function ChatMain() {
	const { messages, sendMessage, status, stop, setMessages } =
		useChat<AIUIMessage>({
			id: "chat-04",
			transport: new DefaultChatTransport({
				api: "/api/ai/agents",
			}),
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
