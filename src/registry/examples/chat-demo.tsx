"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import {
	MessageArea,
	MessageAreaContent,
	MessageAreaScrollButton,
} from "@/registry/ui/message-area";

const INITIAL_MESSAGES: UIMessage[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "👋 Welcome to Simple-AI.dev! We're your go-to library for copy-paste AI components and React Flow workflows.",
			},
		],
		role: "assistant",
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "This chat interface you're looking at? It's just one of our many copy-paste friendly components. Built with the Vercel AI SDK, it's ready for your AI applications with features like streaming responses and seamless LLM integration.",
			},
		],
		role: "assistant",
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "Want to explore our other components, app blocks, or AI workflow tools? Feel free to ask!",
			},
		],
		role: "assistant",
	},
];

export default function ChatDemo() {
	const [input, setInput] = useState("");

	const { messages, sendMessage, status, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
		}),
		messages: INITIAL_MESSAGES,
		onFinish: ({ message }) => {
			//console.log("onFinish", message, completion);
			track({
				name: "example_used",
				properties: {
					used_example: "chat-demo",
					used_example_ai_completion: JSON.stringify(
						message.parts,
						null,
						2,
					),
				},
			});
		},
	});

	const isLoading = status === "streaming" || status === "submitted";

	const track = useTrackEvent();

	const handleSubmitMessage = () => {
		if (isLoading) {
			return;
		}
		sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
		setInput("");
	};

	return (
		<div className="w-full">
			<Card className="w-full max-w-xl mx-auto flex flex-col flex-1 h-[500px]">
				<div className="flex-1 flex flex-col min-h-0">
					<MessageArea>
						<MessageAreaContent>
							{messages.map((message) => {
								if (message.role !== "user") {
									return (
										<ChatMessage
											key={message.id}
											id={message.id}
										>
											<ChatMessageAvatar />
											{message.parts
												.filter(
													(part) =>
														part.type === "text",
												)
												.map((part) => (
													<ChatMessageContent
														key={part.type}
														content={part.text}
													/>
												))}
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
										{message.parts
											.filter(
												(part) => part.type === "text",
											)
											.map((part) => (
												<ChatMessageContent
													key={part.type}
													content={part.text}
												/>
											))}
									</ChatMessage>
								);
							})}
						</MessageAreaContent>
						<MessageAreaScrollButton />
					</MessageArea>
					<div className="border-t p-4">
						<ChatInput
							value={input}
							onChange={(e) => setInput(e.target.value)}
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
