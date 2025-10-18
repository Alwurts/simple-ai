"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarHeader,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTrackEvent } from "@/lib/events";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "@/registry/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarAssistantIcon,
	ChatMessageAvatarUserIcon,
	ChatMessageContainer,
	ChatMessageContent,
	ChatMessageHeader,
	ChatMessageMarkdown,
	ChatMessageTimestamp,
} from "@/registry/ui/chat-message";
import {
	ChatMessageArea,
	ChatMessageAreaContent,
	ChatMessageAreaScrollButton,
} from "@/registry/ui/chat-message-area";

const INITIAL_MESSAGES: UIMessage[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hi! I'm here to help you build amazing user interfaces. What kind of app are you working on?",
			},
		],
		role: "assistant",
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "I want to build a task management app but I'm not sure where to start with the UI design.",
			},
		],
		role: "user",
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "That's a great project! Let's break it down. For a task management app, we should focus on three key components: a clean navigation sidebar, a main task list view, and an intuitive task creation interface. Would you like to start with the layout structure first?",
			},
		],
		role: "assistant",
	},
	{
		id: "4",
		parts: [
			{
				type: "text",
				text: "Yes, that sounds good! How should I organize the layout?",
			},
		],
		role: "user",
	},
	{
		id: "5",
		parts: [
			{
				type: "text",
				text: "For the layout, I recommend a two-column design. The left sidebar can contain project categories and filters, while the main area shows your tasks. This is a common pattern that users are familiar with. Should we start designing the sidebar first?",
			},
		],
		role: "assistant",
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { messages, sendMessage, status, stop } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
		}),
		messages: INITIAL_MESSAGES,
		onFinish: ({ message }) => {
			//console.log("onFinish", message, completion);
			track({
				name: "block_used",
				properties: {
					used_block: "chat-02",
					used_block_ai_completion: JSON.stringify(
						message.parts,
						null,
						2,
					),
				},
			});
		},
	});
	const track = useTrackEvent();
	const isLoading = status === "streaming" || status === "submitted";

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsedValue) => {
			sendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

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
				<ChatMessageArea>
					<ChatMessageAreaContent>
						{messages.map((message) => {
							return (
								<ChatMessage key={message.id}>
									<ChatMessageAvatar>
										{message.role === "user" ? (
											<ChatMessageAvatarUserIcon />
										) : (
											<ChatMessageAvatarAssistantIcon />
										)}
									</ChatMessageAvatar>

									<ChatMessageContainer>
										<ChatMessageHeader>
											<ChatMessageAuthor>
												{message.role === "user"
													? "You"
													: "Assistant"}
											</ChatMessageAuthor>
											<ChatMessageTimestamp
												createdAt={new Date()}
											/>
										</ChatMessageHeader>
										<ChatMessageContent>
											{message.parts
												.filter(
													(part) =>
														part.type === "text",
												)
												.map((part) => (
													<ChatMessageMarkdown
														key={part.type}
														content={part.text}
													/>
												))}
										</ChatMessageContent>
									</ChatMessageContainer>
								</ChatMessage>
							);
						})}
					</ChatMessageAreaContent>
					<ChatMessageAreaScrollButton alignment="center" />
				</ChatMessageArea>
				<div className="p-4 max-w-2xl mx-auto w-full">
					<ChatInput
						value={value}
						onChange={onChange}
						onSubmit={handleSubmit}
						isStreaming={isLoading}
						onStop={stop}
					>
						<ChatInputEditor placeholder="Type a message..." />
						<ChatInputGroupAddon align="block-end">
							<ChatInputSubmitButton className="ml-auto" />
						</ChatInputGroupAddon>
					</ChatInput>
				</div>
			</div>
		</Sidebar>
	);
}
