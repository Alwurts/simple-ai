import type { ComponentProps } from "react";
import { ChatInputArea } from "./chat-input-area";
import { Chat } from "./chat-layout";
import { ChatMessages } from "./chat-messages";

export function ChatFull(props: ComponentProps<typeof Chat>) {
	return (
		<Chat {...props}>
			<ChatMessages />
			<ChatInputArea />
		</Chat>
	);
}
