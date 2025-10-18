"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useTrackEvent } from "@/lib/events";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "@/registry/ui/chat-input";
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
import {
	MessageArea,
	MessageAreaContent,
	MessageAreaScrollButton,
} from "@/registry/ui/message-area";

const INITIAL_MESSAGES: UIMessage[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hello! Welcome to our customer support. How can I assist you today?",
			},
		],
		role: "assistant",
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "Hi, I received my order yesterday but the size of the shirt is too small. I'd like to exchange it for a larger size.",
			},
		],
		role: "user",
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "I'm sorry to hear that the size didn't work out. I'll be happy to help you with the exchange. Could you please provide your order number? You can find it in your confirmation email.",
			},
		],
		role: "assistant",
	},
];

export function Chat() {
	const { messages, sendMessage, status, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
		}),
		messages: INITIAL_MESSAGES,
		onFinish: ({ message }) => {
			//console.log("onFinish", message, completion);
			track({
				name: "block_used",
				properties: {
					used_block: "chat-03",
					used_block_ai_completion: JSON.stringify(
						message.parts,
						null,
						2,
					),
				},
			});
		},
	});
	const track = useTrackEvent();
	const isLoading = status === "streaming" || status === "submitted";

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsedValue) => {
			sendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<MessageArea>
				<MessageAreaContent>
					{messages.map((message) => {
						return (
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
											{message.role === "user"
												? "You"
												: "Assistant"}
										</ChatMessageAuthor>
										<ChatMessageTimestamp
											createdAt={new Date()}
										/>
									</ChatMessageHeader>
									<ChatMessageContent>
										{message.parts
											.filter(
												(part) => part.type === "text",
											)
											.map((part) => (
												<ChatMessageMarkdown
													key={part.type}
													content={part.text}
												/>
											))}
									</ChatMessageContent>
								</ChatMessageContainer>
							</ChatMessage>
						);
					})}
				</MessageAreaContent>
				<MessageAreaScrollButton />
			</MessageArea>
			<div className="px-2 py-2 border-t">
				<ChatInput
					value={value}
					onChange={onChange}
					onSubmit={handleSubmit}
					isStreaming={isLoading}
					onStop={stop}
				>
					<ChatInputEditor placeholder="Type a message..." />
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" />
					</ChatInputGroupAddon>
				</ChatInput>
			</div>
		</div>
	);
}
