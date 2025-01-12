"use client";

import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";
import { useChat } from "ai/react";

export function Chat() {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
		useChat({
			api: "/api/ai/chat",
			initialMessages: [
				{
					id: "1",
					content:
						"Hello! Welcome to our customer support. How can I assist you today?",
					role: "assistant",
				},
				{
					id: "2",
					content:
						"Hi, I received my order yesterday but the size of the shirt is too small. I'd like to exchange it for a larger size.",
					role: "user",
				},
				{
					id: "3",
					content:
						"I'm sorry to hear that the size didn't work out. I'll be happy to help you with the exchange. Could you please provide your order number? You can find it in your confirmation email.",
					role: "assistant",
				},
				{
					id: "4",
					content: "Yes, my order number is #ORD-2024-45678",
					role: "user",
				},
				{
					id: "5",
					content:
						"Thank you for providing the order number. I can see you ordered a Classic Cotton T-shirt in size S. What size would you like to exchange it for?",
					role: "assistant",
				},
				{
					id: "6",
					content: "I'd like to get a size M instead",
					role: "user",
				},
				{
					id: "7",
					content:
						"Perfect, I've checked and size M is available in stock. I'll guide you through the exchange process. First, we'll send you a return label for the current item. Once we receive it, we'll ship the new size to you. Would you like me to proceed with generating the return label?",
					role: "assistant",
				},
				{
					id: "8",
					content: "Yes, please. That would be great!",
					role: "user",
				},
				{
					id: "9",
					content:
						"I've generated the return label and sent it to your email. You should receive it within the next few minutes. Once you've packed the item, simply attach the label and drop it off at any postal office. Is there anything else you need help with?",
					role: "assistant",
				},
			],
		});

	const handleSubmitMessage = () => {
		if (isLoading) {
			return;
		}
		handleSubmit();
	};

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<ChatMessageArea className="px-4 py-4 space-y-4">
				{messages.map((message) => {
					if (message.role !== "user") {
						return (
							<ChatMessage
								key={message.id}
								id={message.id}
								variant="bubble"
								type="incoming"
							>
								<ChatMessageAvatar imageSrc="/avatar-1.png" />
								<ChatMessageContent content={message.content} />
							</ChatMessage>
						);
					}
					return (
						<ChatMessage
							key={message.id}
							id={message.id}
							variant="bubble"
							type="outgoing"
						>
							<ChatMessageContent content={message.content} />
							<ChatMessageAvatar imageSrc="/avatar-1.png" />
						</ChatMessage>
					);
				})}
			</ChatMessageArea>
			<div className="px-2 py-2 border-t">
				<ChatInput
					value={input}
					onChange={handleInputChange}
					onSubmit={handleSubmitMessage}
					loading={isLoading}
					onStop={stop}
				>
					<ChatInputTextArea placeholder="Type a message..." />
					<ChatInputSubmit />
				</ChatInput>
			</div>
		</div>
	);
}
