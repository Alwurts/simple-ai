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
import type { Message } from "ai/react";

export default function ChatPage() {
	const messages: Message[] = [
		{
			id: "1",
			content: "Do you think robots will ever take over the world?",
			role: "user",
		},
		{
			id: "2",
			content:
				"That's a popular sci-fi theme, but realistically, robots would need to develop self-awareness, motives, and a form of societal organization far beyond current capabilities. What do you think would be the first sign of robots taking over?",
			role: "assistant",
		},
		{
			id: "3",
			content:
				"I guess if they start making decisions independently, like choosing which news to report or something.",
			role: "user",
		},
		{
			id: "4",
			content:
				"Interesting point. Autonomy in decision-making could be a precursor. But then again, AI already influences what news we see through algorithms. What about robots in daily life, like home assistants? Do you think they could become a threat?",
			role: "assistant",
		},
		{
			id: "5",
			content:
				"Maybe if they start to understand human emotions better than we do? Like, if my coffee maker knew I was stressed and made me a chamomile tea instead of coffee!",
			role: "user",
		},
		{
			id: "6",
			content:
				"That's a humorous thought! Emotional intelligence in machines could indeed change how we interact with technology. But imagine the privacy concerns if our appliances knew too much about our emotional states. How do you feel about privacy in the age of smart devices?",
			role: "assistant",
		},
		{
			id: "7",
			content:
				"It's pretty scary. I mean, I like my tech to be smart, but not too smart, you know? Like, I don't need my fridge telling my insurance company I eat too much ice cream.",
			role: "user",
		},
		{
			id: "8",
			content:
				"Exactly! There's a balance to strike between convenience and privacy. Perhaps regulations will evolve to keep up with technology. But speaking of ice cream, what's your favorite flavor?",
			role: "assistant",
		},
		{
			id: "9",
			content: "Mint chocolate chip, hands down. What about you?",
			role: "user",
		},
		{
			id: "10",
			content:
				"I'm more of a vanilla fan, but I can appreciate a good mint chocolate chip. Ever tried making your own ice cream?",
			role: "assistant",
		},
	];

	return (
		<div className="container-wrapper flex-1 flex flex-col">
			<div className="container p-4 flex-1">
				<Card className="w-full max-w-4xl mx-auto flex flex-col flex-1 h-[80vh] overflow-hidden">
					<div className="flex-1 flex flex-col min-h-0">
						<ChatMessageArea>
							{messages.map((message) => {
								return (
									<ChatMessage
										key={message.id}
										id={message.id}
										type={message.role === "user" ? "outgoing" : "incoming"}
										variant="full"
									>
										{message.role !== "user" && <ChatMessageAvatar />}
										<ChatMessageContent content={message.content} />
										{message.role === "user" && <ChatMessageAvatar />}
									</ChatMessage>
								);
							})}
						</ChatMessageArea>
						<div className="border-t p-4">
							<ChatInput variant="default">
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
