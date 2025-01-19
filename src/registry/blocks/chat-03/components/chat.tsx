"use client";

import { useTrackEvent } from "@/lib/events";
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
			],
			onFinish: (message) => {
				//console.log("onFinish", message, completion);
				track({
					name: "block_used",
					properties: {
						used_block: "chat-03",
						used_block_ai_completion: message.content,
					},
				});
			},
		});
	const track = useTrackEvent();

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
