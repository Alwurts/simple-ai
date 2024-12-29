"use client";

import { Card } from "@/components/ui/card";
import { ChatInput } from "@/components/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/components/ui/chat-message";
import { ChatMessageArea } from "@/components/ui/chat-message-area";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Message } from "ai/react";

export default function ChatPage() {
	const messages: Message[] = [
		{
			id: "1",
			content: "Hey, how's your day going?",
			role: "user",
		},
		{
			id: "2",
			content: "It's going pretty well, thanks for asking! How about yours?",
			role: "assistant",
		},
		{
			id: "3",
			content: "Not bad, just chilling at home. What did you do today?",
			role: "user",
		},
		{
			id: "4",
			content:
				"I spent some time reading and then went for a walk. It was nice. I later went to the gym and then had dinner with some friends. In the evening, I watched a movie and then went to bed.",
			role: "assistant",
		},
		{
			id: "5",
			content: "What about you? What did you do today?",
			role: "assistant",
		},
	];

	return (
		<div className="container-wrapper flex-1 flex flex-col">
			<div className="container p-4 flex-1">
				<Card className="w-full max-w-xl mx-auto flex flex-col flex-1 h-[80vh]">
					<div className="flex-1 flex flex-col min-h-0">
						<ChatMessageArea className="px-4 py-8 space-y-4">
							{messages.map((message) => {
								if (message.role !== "user") {
									return (
										<ChatMessage key={message.id} align="left">
											<ChatMessageAvatar />
											<ChatMessageContent
												id={message.id}
												content={message.content}
											/>
										</ChatMessage>
									);
								}
								return (
									<ChatMessage
										key={message.id}
										align="right"
										variant="bubble"
										type="outgoing"
									>
										<ChatMessageContent
											id={message.id}
											content={message.content}
										/>
									</ChatMessage>
								);
							})}
						</ChatMessageArea>
						<div className="border-t p-4">
							<div className="flex items-center space-x-2">
								<ChatInput />
								<SubmitButton />
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
