"use client";

import type * as React from "react";

import {
	Sidebar,
	SidebarHeader,
	SidebarSeparator,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { MessageCircle } from "lucide-react";
import { SquarePen } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
		useChat({
			api: "/api/ai/chat",
			initialMessages: [
				{
					id: "1",
					content:
						"Hi! I'm here to help you build amazing user interfaces. What kind of app are you working on?",
					role: "assistant",
				},
				{
					id: "2",
					content:
						"I want to build a task management app but I'm not sure where to start with the UI design.",
					role: "user",
				},
				{
					id: "3",
					content:
						"That's a great project! Let's break it down. For a task management app, we should focus on three key components: a clean navigation sidebar, a main task list view, and an intuitive task creation interface. Would you like to start with the layout structure first?",
					role: "assistant",
				},
				{
					id: "4",
					content: "Yes, that sounds good! How should I organize the layout?",
					role: "user",
				},
				{
					id: "5",
					content:
						"For the layout, I recommend a two-column design. The left sidebar can contain project categories and filters, while the main area shows your tasks. This is a common pattern that users are familiar with. Should we start designing the sidebar first?",
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
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="flex items-center justify-between p-2">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
							<MessageCircle className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-lg font-semibold">simple-ai</span>
					</div>
					{/* New Chat Button */}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button size="icon" variant="ghost">
									<SquarePen className="h-5 w-5" />
									<span className="sr-only">New Chat</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>New Chat</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</SidebarHeader>
			<SidebarSeparator />
			<div className="flex-1 flex flex-col h-full overflow-y-auto">
				<ChatMessageArea
					scrollButtonAlignment="center"
					className="px-4 py-6 space-y-4"
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
				<div className="p-4 max-w-2xl mx-auto w-full">
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
		</Sidebar>
	);
}
