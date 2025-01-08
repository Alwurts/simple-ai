"use client";

import { Card } from "@/components/ui/card";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";
import { SubmitButton } from "@/registry/ui/submit-button";
import { cn } from "@/lib/utils";
import { ChatInput } from "@/registry/ui/chat-input";
import { useChat } from "ai/react";
import { toast } from "sonner";

export default function Chat({ className }: { className?: string }) {
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
		<Card className={cn("flex flex-col flex-1 h-full", className)}>
			<div className="flex-1 flex flex-col min-h-0">
				<ChatMessageArea className="px-4 py-8 space-y-4">
					{messages.map((message) => (
						<ChatMessage
							key={message.id}
							align={message.role === "user" ? "right" : "left"}
							type={message.role === "user" ? "outgoing" : "incoming"}
							variant="bubble"
							className="w-11/12"
						>
							{message.role !== "user" && (
								<ChatMessageAvatar imageSrc="/avatar-2.png" />
							)}
							<ChatMessageContent id={message.id} content={message.content} />
							{message.role === "user" && (
								<ChatMessageAvatar imageSrc="/avatar-1.png" />
							)}
						</ChatMessage>
					))}
				</ChatMessageArea>
				<div className="border-t p-4">
					<div className="flex items-center space-x-2">
						<ChatInput
							value={input}
							onChange={handleInputChange}
							submitMessage={handleSubmitMessage}
						/>
						<SubmitButton
							loading={isLoading}
							submitMessage={handleSubmitMessage}
							stop={stop}
						/>
					</div>
				</div>
			</div>
		</Card>
	);
}
