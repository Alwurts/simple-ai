"use client";

import { Card } from "@/components/ui/card";
import {
	ChatInput,
	ChatInputTextArea,
	ChatInputSubmit,
} from "@/registry/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";
import type { Message } from "ai/react";
import { useState } from "react";

const messages: Message[] = [
	{
		id: "1",
		content: "Can you tell me about the recent findings on dark matter?",
		role: "user",
	},
	{
		id: "2",
		content:
			"Here's a summary of a recent article on dark matter:\n\n**Title:** *New Insights into Dark Matter Properties*\n\n**Authors:** J. Smith, A. Johnson, L. Martinez\n\n**Journal:** *Astrophysical Journal*\n\n**Year:** 2024\n\n**Abstract:**\nRecent observations from the [Dark Energy Survey](https://www.darkenergysurvey.org/) have provided new data suggesting that dark matter might interact with itself more than previously thought. This study discusses the implications of these findings on the current models of cosmology.\n\n**DOI:** [10.1088/1234-5678/90/1/123](https://doi.org/10.1088/1234-5678/90/1/123)\n\n**Full Text:** Available at your local university library or through subscription services.",
		role: "assistant",
	},
	{
		id: "3",
		content: "What do you think about the findings?",
		role: "user",
	},
	{
		id: "4",
		content:
			"I think it's interesting, but I'm not sure how much it changes our understanding of dark matter.",
		role: "assistant",
	},
];

export default function ChatPage() {
	const [inputValue, setInputValue] = useState("");

	return (
		<div className="container-wrapper flex-1 flex flex-col">
			<div className="container p-4 flex-1">
				<Card className="w-full max-w-5xl mx-auto flex flex-col flex-1 h-[80vh]">
					<div className="flex-1 flex flex-col min-h-0">
						<ChatMessageArea>
							{messages.map((message) => {
								return (
									<ChatMessage
										key={message.id}
										id={message.id}
										className="justify-start"
										variant="full"
										type={message.role !== "user" ? "incoming" : "outgoing"}
									>
										<ChatMessageAvatar />
										<ChatMessageContent content={message.content} />
									</ChatMessage>
								);
							})}
						</ChatMessageArea>
						<div className="border-t p-4">
							<ChatInput
								variant="default"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onSubmit={() => setInputValue("")}
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
