"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { FileIcon, PlusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTrackEvent } from "@/lib/events";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputGroupButton,
	ChatInputGroupText,
	ChatInputMention,
	ChatInputSubmitButton,
	createMentionConfig,
	useChatInput,
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

type MemberItem = {
	id: string;
	name: string;
	image?: string;
	type: string;
};

type FileItem = {
	id: string;
	name: string;
};

const members: MemberItem[] = [
	{ id: "1", name: "Alice", image: "/alice.jpg", type: "agent" },
	{ id: "2", name: "Bob", type: "user" },
	{ id: "3", name: "Charlie", image: "/charlie.jpg", type: "bot" },
	{ id: "4", name: "Dave", type: "user" },
	{ id: "5", name: "Eve", image: "/eve.jpg", type: "bot" },
	{ id: "6", name: "Frank", type: "user" },
	{ id: "7", name: "Grace", image: "/grace.jpg", type: "bot" },
	{ id: "8", name: "Henry", type: "user" },
	{ id: "9", name: "Ivy", image: "/ivy.jpg", type: "bot" },
	{ id: "10", name: "Jack", type: "user" },
	{ id: "11", name: "Kate", image: "/kate.jpg", type: "bot" },
	{ id: "12", name: "Liam", type: "user" },
	{ id: "13", name: "Mia", image: "/mia.jpg", type: "bot" },
	{ id: "14", name: "Noah", type: "user" },
	{ id: "15", name: "Olivia", image: "/olivia.jpg", type: "bot" },
	{ id: "16", name: "Peter", type: "user" },
	{ id: "17", name: "Quinn", image: "/quinn.jpg", type: "bot" },
	{ id: "18", name: "Ryan", type: "user" },
	{ id: "19", name: "Sarah", image: "/sarah.jpg", type: "bot" },
	{ id: "20", name: "Thomas", type: "user" },
	{ id: "21", name: "Uma", image: "/uma.jpg", type: "bot" },
	{ id: "22", name: "Victor", type: "user" },
];

const files: FileItem[] = [
	{ id: "f1", name: "report.pdf" },
	{ id: "f2", name: "image.png" },
	{ id: "f3", name: "notes.txt" },
];

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

	const { value, onChange, handleSubmit, mentionConfigs } = useChatInput({
		mentions: {
			member: createMentionConfig<MemberItem>({
				type: "member",
				trigger: "@",
				items: members,
			}),
			file: createMentionConfig<FileItem>({
				type: "file",
				trigger: "/",
				items: files,
			}),
		},
		onSubmit: (parsedValue) => {
			sendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

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
							onSubmit={handleSubmit}
							value={value}
							onChange={onChange}
							isStreaming={isLoading}
							onStop={stop}
						>
							<ChatInputMention
								type={mentionConfigs.member.type}
								trigger={mentionConfigs.member.trigger}
								items={mentionConfigs.member.items}
							>
								{(item) => (
									<>
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={
													item.image ??
													"/placeholder.jpg"
												}
												alt={item.name}
											/>
											<AvatarFallback>
												{item.name[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>

										<span
											className="text-sm font-medium truncate max-w-[120px]"
											title={item.name}
										>
											{item.name}
										</span>
										<Badge
											variant="outline"
											className="ml-auto"
										>
											{item.type}
										</Badge>
									</>
								)}
							</ChatInputMention>
							<ChatInputMention
								type={mentionConfigs.file.type}
								trigger={mentionConfigs.file.trigger}
								items={mentionConfigs.file.items}
							>
								{(item) => (
									<>
										<FileIcon className="h-4 w-4 text-muted-foreground" />
										<span
											className="text-sm font-medium truncate max-w-[200px]"
											title={item.name}
										>
											{item.name}
										</span>
									</>
								)}
							</ChatInputMention>
							<ChatInputEditor placeholder="Type @ for agents, / for files..." />
							<ChatInputGroupAddon align="block-end">
								<ChatInputGroupButton
									variant="outline"
									className="rounded-full"
									size="icon-sm"
								>
									<PlusIcon />
								</ChatInputGroupButton>
								<ChatInputGroupText className="ml-auto">
									52% used
								</ChatInputGroupText>
								<Separator
									orientation="vertical"
									className="!h-6"
								/>
								<ChatInputSubmitButton />
							</ChatInputGroupAddon>
						</ChatInput>
					</div>
				</div>
			</Card>
		</div>
	);
}
