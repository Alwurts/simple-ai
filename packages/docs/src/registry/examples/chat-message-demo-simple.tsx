"use client";

import type { UIMessage } from "@ai-sdk/react";
import {
	ChatMessage,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarAssistantIcon,
	ChatMessageAvatarUserIcon,
	ChatMessageContainer,
	ChatMessageContent,
	ChatMessageHeader,
	ChatMessageMarkdown,
	ChatMessageTimestamp,
} from "@/registry/ui/chat-message";

const messages: UIMessage[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hey, how are you doing today?",
			},
		],
		role: "user",
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "I'm doing great! Just working on some projects. How can I help you?",
			},
		],
		role: "assistant",
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "I need help with my React application.",
			},
		],
		role: "user",
	},
];

export default function ChatMessageDemoSimple() {
	return (
		<div className="w-full max-h-[400px] overflow-y-auto">
			{messages.map(message => (
				<ChatMessage key={message.id}>
					<ChatMessageAvatar>
						{message.role === "user" ? (
							<ChatMessageAvatarUserIcon />
						) : (
							<ChatMessageAvatarAssistantIcon />
						)}
					</ChatMessageAvatar>

					<ChatMessageContainer>
						<ChatMessageHeader>
							<ChatMessageAuthor>
								{message.role === "user" ? "You" : "Assistant"}
							</ChatMessageAuthor>
							<ChatMessageTimestamp createdAt={new Date()} />
						</ChatMessageHeader>
						<ChatMessageContent>
							{message.parts
								.filter(part => part.type === "text")
								.map(part => (
									<ChatMessageMarkdown key={part.type} content={part.text} />
								))}
						</ChatMessageContent>
					</ChatMessageContainer>
				</ChatMessage>
			))}
		</div>
	);
}
