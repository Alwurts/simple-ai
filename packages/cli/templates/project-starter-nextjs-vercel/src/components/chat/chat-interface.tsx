"use client";

import { ChatInputArea } from "@/components/chat/parts/chat-input-area";
import { Chat } from "@/components/chat/parts/chat-layout";
import { ChatMessages } from "@/components/chat/parts/chat-messages";
import type { AIUIMessage } from "@/types/ai";

interface ChatInterfaceProps {
	id: string;
	initialMessages: AIUIMessage[];
	onNewChat?: (chatId: string) => void;
}

export function ChatInterface({ id, initialMessages, onNewChat }: ChatInterfaceProps) {
	return (
		<Chat id={id} initialMessages={initialMessages} onNewChat={onNewChat}>
			<ChatMessages />
			<ChatInputArea />
		</Chat>
	);
}
