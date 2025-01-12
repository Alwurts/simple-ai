"use client";

import { Card } from "@/components/ui/card";
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

export default function ChatDemo() {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
		useChat({
			api: "/api/ai/chat",
			initialMessages: [
				{
					id: "1",
					content:
						"Hi! Welcome to simple-ai, the collection of chat UI components that you can easily use to build your chat AI applications.",
					role: "assistant",
				},
				{
					id: "2",
					content: "Would you like to know more?",
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
		<div className="w-full">
			<Card className="w-full max-w-xl mx-auto flex flex-col flex-1 h-[500px]">
				<div className="flex-1 flex flex-col min-h-0">
					<ChatMessageArea className="px-4 py-8 space-y-4">
						{messages.map((message) => {
							if (message.role !== "user") {
								return (
									<ChatMessage key={message.id} id={message.id}>
										<ChatMessageAvatar />
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
								</ChatMessage>
							);
						})}
					</ChatMessageArea>
					<div className="border-t p-4">
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
			</Card>
		</div>
	);
}
