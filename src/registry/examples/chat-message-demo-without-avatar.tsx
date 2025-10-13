"use client";

import { ChatMessage, ChatMessageContent } from "@/registry/ui/chat-message";

const messages = [
	{
		id: "1",
		content: "Hey how are you?",
		type: "user",
	},
	{
		id: "2",
		content: "I'm fine, thanks for asking!",
		type: "assistant",
	},
	{
		id: "3",
		content: "Great!",
		type: "user",
	},
];

export default function ChatMessageDemoWithoutAvatar() {
	return (
		<div className="w-full space-y-4">
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					id={message.id}
					type={message.type === "user" ? "outgoing" : "incoming"}
					variant="bubble"
				>
					<ChatMessageContent content={message.content} />
				</ChatMessage>
			))}
		</div>
	);
}
