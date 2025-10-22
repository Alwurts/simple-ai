"use client";

import type { UIMessage } from "@ai-sdk/react";
import { Copy, ThumbsUp } from "lucide-react";
import {
	ChatMessage,
	ChatMessageAction,
	ChatMessageActions,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarFallback,
	ChatMessageAvatarImage,
	ChatMessageContainer,
	ChatMessageContent,
	ChatMessageHeader,
	ChatMessageMarkdown,
	ChatMessageThread,
	ChatMessageThreadAction,
	ChatMessageThreadReplyCount,
	ChatMessageThreadTimestamp,
	ChatMessageTimestamp,
} from "@/registry/ui/chat-message";

const messages: UIMessage<{
	member: {
		image: string;
		name: string;
	};
	threadData?: {
		messageCount: number;
		lastReply: Date;
		member: {
			image: string;
			name: string;
		};
	};
}>[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Can you implement the new user authentication feature?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "Sure, I'll work on implementing the user authentication feature. I'll respond on the thread with updates as I progress.",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-2.png",
				name: "Project Assistant",
			},
			threadData: {
				messageCount: 3,
				lastReply: new Date(),
				member: {
					image: "/avatar-1.png",
					name: "Pedro",
				},
			},
		},
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "What's the progress on the other task?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
];

export default function ChatMessageDemo() {
	return (
		<div className="w-full max-h-[400px] overflow-y-auto">
			{messages.map((message) => (
				<ChatMessage key={message.id}>
					<ChatMessageActions>
						<ChatMessageAction label="Copy">
							<Copy className="size-4" />
						</ChatMessageAction>
						<ChatMessageAction label="Like">
							<ThumbsUp className="size-4" />
						</ChatMessageAction>
					</ChatMessageActions>

					<ChatMessageAvatar>
						<ChatMessageAvatarImage
							src={message.metadata?.member.image}
						/>
						<ChatMessageAvatarFallback>
							{message.metadata?.member.name
								.charAt(0)
								.toUpperCase()}
						</ChatMessageAvatarFallback>
					</ChatMessageAvatar>

					<ChatMessageContainer>
						<ChatMessageHeader>
							<ChatMessageAuthor>
								{message.metadata?.member.name}
							</ChatMessageAuthor>
							<ChatMessageTimestamp createdAt={new Date()} />
						</ChatMessageHeader>

						<ChatMessageContent>
							{message.parts
								.filter((part) => part.type === "text")
								.map((part) => (
									<ChatMessageMarkdown
										key={part.type}
										content={part.text}
									/>
								))}
						</ChatMessageContent>

						{message.metadata?.threadData && (
							<ChatMessageThread>
								<ChatMessageAvatar>
									<ChatMessageAvatarImage
										src={
											message.metadata?.threadData.member
												.image
										}
									/>
									<ChatMessageAvatarFallback>
										{message.metadata?.threadData.member.name
											.charAt(0)
											.toUpperCase()}
									</ChatMessageAvatarFallback>
								</ChatMessageAvatar>
								<ChatMessageThreadReplyCount>
									{message.metadata.threadData.messageCount}{" "}
									replies
								</ChatMessageThreadReplyCount>
								<ChatMessageThreadTimestamp
									date={message.metadata.threadData.lastReply}
								/>
								<ChatMessageThreadAction />
							</ChatMessageThread>
						)}
					</ChatMessageContainer>
				</ChatMessage>
			))}
		</div>
	);
}
