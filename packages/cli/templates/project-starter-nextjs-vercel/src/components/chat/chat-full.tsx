import type { ComponentProps } from "react";
import { ChatInputArea } from "@/components/chat/parts/chat-input-area";
import { Chat } from "@/components/chat/parts/chat-layout";
import { ChatMessages } from "@/components/chat/parts/chat-messages";

export function ChatFull(props: ComponentProps<typeof Chat>) {
	return (
		<Chat {...props}>
			<ChatMessages />
			<ChatInputArea />
		</Chat>
	);
}
