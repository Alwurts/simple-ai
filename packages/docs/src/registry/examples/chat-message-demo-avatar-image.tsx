"use client";

import type { UIMessage } from "@ai-sdk/react";
import {
	ChatMessage,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarImage,
	ChatMessageContainer,
	ChatMessageContent,
	ChatMessageHeader,
	ChatMessageMarkdown,
	ChatMessageTimestamp,
} from "@/registry/ui/chat-message";

const messages: UIMessage<{
	avatarImage: string;
}>[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hi there! This is a user message with an avatar image.",
			},
		],
		role: "user",
		metadata: {
			avatarImage: "/avatar-1.png",
		},
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "And this is an assistant message with its own avatar image.",
			},
		],
		role: "assistant",
		metadata: {
			avatarImage: "/avatar-2.png",
		},
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "Great! Avatar images are displaying properly.",
			},
		],
		role: "user",
		metadata: {
			avatarImage: "/avatar-1.png",
		},
	},
];

export default function ChatMessageDemoAvatarImage() {
	return (
		<div className="w-full max-h-[400px] overflow-y-auto">
			{messages.map(message => (
				<ChatMessage key={message.id}>
					<ChatMessageAvatar>
						<ChatMessageAvatarImage
							src={message.metadata?.avatarImage}
							alt="Avatar"
						/>
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
