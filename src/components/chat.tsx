"use client";

import { Card } from "@/components/ui/card";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessage } from "@/components/ui/message";
import { MessageArea } from "@/components/ui/message-area";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils";
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
				<MessageArea className="px-4 py-8 space-y-4">
					{messages.map((message) => (
						<ChatMessage key={message.id} message={message} />
					))}
				</MessageArea>
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
