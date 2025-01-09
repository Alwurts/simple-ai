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
import { toast } from "sonner";

export default function ChatPage() {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
		useChat({
			api: "/api/ai/chat",
		});

	const handleSubmitMessage = () => {
		if (isLoading) {
			toast("Wait for the current response to finish");
			return;
		}
		handleSubmit();
	};

	return (
		<div className="container-wrapper flex-1 flex flex-col">
			<div className="container p-4 flex-1">
				<Card className="w-full max-w-xl mx-auto flex flex-col flex-1 h-[80vh]">
					<div className="flex-1 flex flex-col min-h-0">
						<ChatMessageArea className="px-6 py-8 space-y-4">
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
								variant="default"
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
		</div>
	);
}
