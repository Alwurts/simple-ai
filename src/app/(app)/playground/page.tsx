"use client";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Card } from "@/components/ui/card";
import { ChatInput } from "@/components/ui/chat-input";
import { SubmitButton } from "@/components/ui/submit-button";
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
		<div className="flex flex-col items-stretch justify-start h-screen">
			<div className="bg-background w-full h-12 border-b border-border flex items-center justify-center">
				<h1 className="text-2xl font-bold">Chat</h1>
				<ThemeToggle className="ml-auto" />
			</div>
			<div className="w-full max-w-3xl mx-auto flex-1 overflow-y-auto p-4">
				<Card className="flex flex-col flex-1 h-full">
					<div className="flex-1 flex flex-col min-h-0">
						{/* <MessageArea className="px-4 py-8 space-y-4">
							{messages.map((message) => (
								<ChatMessage key={message.id} message={message} />
							))}
						</MessageArea> */}
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
			</div>
		</div>
	);
}
