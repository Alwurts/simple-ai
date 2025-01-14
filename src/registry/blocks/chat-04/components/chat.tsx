"use client";

import { cn } from "@/lib/utils";
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
import type { ComponentPropsWithoutRef } from "react";

export function Chat({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
		useChat({
			api: "/api/ai/chat",
			initialMessages: [
				{
					id: "1",
					content:
						"Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
					role: "user",
				},
				{
					id: "2",
					content:
						"I'd be happy to help you with project management best practices! Here's a structured approach:\n\n## 1. Project Initiation\n- Define clear project objectives\n- Identify key stakeholders\n- Set measurable goals\n- Create project charter\n\n## 2. Planning Phase\n- Break down work into tasks\n- Set priorities\n- Create timeline\n- Assign responsibilities\n\nWould you like me to elaborate on any of these points?",
					role: "assistant",
				},
				{
					id: "3",
					content:
						"Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
					role: "user",
				},
				{
					id: "4",
					content:
						"I'd be happy to help you with project management best practices! Here's a structured approach:\n\n## 1. Project Initiation\n- Define clear project objectives\n- Identify key stakeholders\n- Set measurable goals\n- Create project charter\n\n## 2. Planning Phase\n- Break down work into tasks\n- Set priorities\n- Create timeline\n- Assign responsibilities\n\nWould you like me to elaborate on any of these points?",
					role: "assistant",
				},
				{
					id: "5",
					content:
						"Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
					role: "user",
				},
				{
					id: "6",
					content:
						"I'd be happy to help you with project management best practices! Here's a structured approach:\n\n## 1. Project Initiation\n- Define clear project objectives\n- Identify key stakeholders\n- Set measurable goals\n- Create project charter\n\n## 2. Planning Phase\n- Break down work into tasks\n- Set priorities\n- Create timeline\n- Assign responsibilities\n\nWould you like me to elaborate on any of these points?",
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
		<div
			{...props}
			className={cn(
				"flex flex-col h-full overflow-y-auto w-[400px] shrink-0",
				className,
			)}
		>
			<ChatMessageArea
				scrollButtonAlignment="center"
				className="p-4 space-y-4"
			>
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
			<div className="px-2 py-4 max-w-2xl mx-auto w-full">
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
