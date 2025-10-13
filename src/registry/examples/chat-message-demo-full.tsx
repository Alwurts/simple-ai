"use client";

import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

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

export default function ChatMessageDemoFull() {
	return (
		<div className="w-full border rounded-lg">
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					id={message.id}
					type={message.type === "user" ? "outgoing" : "incoming"}
					variant="full"
				>
					{message.type === "assistant" && <ChatMessageAvatar />}
					<ChatMessageContent content={message.content} />
					{message.type === "user" && <ChatMessageAvatar />}
				</ChatMessage>
			))}
		</div>
	);
}
