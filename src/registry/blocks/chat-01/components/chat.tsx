"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, ThumbsUp } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
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
	ChatMessageAction,
	ChatMessageActions,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarFallback,
	ChatMessageAvatarImage,
	ChatMessageContainer,
	ChatMessageContent,
	ChatMessageHeader,
	ChatMessageMarkdown,
	ChatMessageThread,
	ChatMessageThreadAction,
	ChatMessageThreadReplyCount,
	ChatMessageThreadTimestamp,
	ChatMessageTimestamp,
} from "@/registry/ui/chat-message";
import {
	ChatMessageArea,
	ChatMessageAreaContent,
	ChatMessageAreaScrollButton,
} from "@/registry/ui/chat-message-area";

const INITIAL_MESSAGES: UIMessage<{
	member: {
		image: string;
		name: string;
	};
	threadData?: {
		member: {
			image: string;
			name: string;
		};
		messageCount: number;
		lastReply: Date;
	};
}>[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
	{
		id: "2",
		parts: [
			{
				type: "text",
				text: "I'd be happy to help you with project management best practices! Here's a structured approach:\n\n#### 1. Project Initiation\n- Define clear project objectives\n- Identify key stakeholders\n- Set measurable goals\n- Create project charter\n\n#### 2. Planning Phase\n- Break down work into tasks\n- Set priorities\n- Create timeline\n- Assign responsibilities\n\nWould you like me to elaborate on any of these points?",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-2.png",
				name: "Travel Assistant",
			},
		},
	},
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "Yes, please tell me more about breaking down work into tasks. How should I approach this?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
	{
		id: "4",
		parts: [
			{
				type: "text",
				text: "Breaking down work into tasks is crucial for project success. Here's a detailed approach:\n\n##### Work Breakdown Structure (WBS)\n1. **Start with major deliverables**\n   - Identify end goals\n   - List main project phases\n\n2. **Break into smaller components**\n   - Tasks should be:\n     - Specific\n     - Measurable\n     - Achievable\n     - Time-bound\n\n3. **Task Estimation**\n   ```\n   Task Example:\n   - Name: User Authentication Feature\n   - Duration: 3 days\n   - Dependencies: Database setup\n   - Priority: High\n   ```\n\n4. **Use the 8/80 Rule**\n   - Tasks shouldn't take less than 8 hours\n   - Or more than 80 hours\n   - If they do, break them down further",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-2.png",
				name: "Travel Assistant",
			},
		},
	},
	{
		id: "5",
		parts: [
			{
				type: "text",
				text: "That's really helpful! What tools would you recommend for tracking all these tasks?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
	{
		id: "6",
		parts: [
			{
				type: "text",
				text: "Here are some popular project management tools:\n\n##### Tips for Tool Selection\n- ✅ Consider team size\n- ✅ Integration needs\n- ✅ Learning curve\n- ✅ Budget constraints\n\nWould you like specific recommendations based on your team's needs?",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-2.png",
				name: "Travel Assistant",
			},
		},
	},
	{
		id: "7",
		parts: [
			{
				type: "text",
				text: "Yes, we're a small team of 5 developers. What would work best for us?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
		},
	},
	{
		id: "8",
		parts: [
			{
				type: "text",
				text: "For a team of 5 developers, I'd recommend:\n\n##### Primary Choice: Jira Software\n\n**Advantages:**\n- 🔧 Built for development teams\n- 📊 Great for agile workflows\n- 🔄 Git integration\n- 📱 Mobile apps\n\n##### Alternative: ClickUp\n\n**Benefits:**\n- 💰 Cost-effective\n- 🎨 More flexible\n- 🚀 Faster setup\n\n```\nRecommended Setup:\n- Sprint Length: 2 weeks\n- Board Structure:\n  - Backlog\n  - To Do\n  - In Progress\n  - Code Review\n  - Testing\n  - Done\n- Key Features:\n  - Story Points\n  - Time Tracking\n  - Sprint Reports\n```\n\nWould you like me to explain how to set up the recommended workflow in either of these tools?",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "Pedro",
			},
			threadData: {
				lastReply: new Date(),
				member: {
					image: "/avatar-2.png",
					name: "Travel Assistant",
				},
				messageCount: 10,
			},
		},
	},
];

export function Chat({ className, ...props }: ComponentPropsWithoutRef<"div">) {
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
					used_block: "chat-01",
					used_block_ai_completion: JSON.stringify(
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

	// Use the new hook with custom onSubmit
	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsedValue) => {
			// Custom logic: log, send, access type-safe fields
			console.log("Submitted parsed:", parsedValue);

			sendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

	return (
		<div className="flex-1 flex flex-col h-full overflow-y-auto" {...props}>
			<ChatMessageArea>
				<ChatMessageAreaContent>
					{messages.map((message) => {
						const userName =
							message.role === "user" ? "You" : "Assistant";
						return (
							<ChatMessage key={message.id}>
								<ChatMessageActions>
									<ChatMessageAction label="Copy">
										<Copy className="size-4" />
									</ChatMessageAction>
									<ChatMessageAction label="Like">
										<ThumbsUp className="size-4" />
									</ChatMessageAction>
								</ChatMessageActions>
								<ChatMessageAvatar>
									<ChatMessageAvatarImage
										src={message.metadata?.member.image}
									/>
									<ChatMessageAvatarFallback>
										{message.metadata?.member.name
											.charAt(0)
											.toUpperCase()}
									</ChatMessageAvatarFallback>
								</ChatMessageAvatar>

								<ChatMessageContainer>
									<ChatMessageHeader>
										<ChatMessageAuthor>
											{userName}
										</ChatMessageAuthor>
										<ChatMessageTimestamp
											createdAt={new Date()}
										/>
									</ChatMessageHeader>

									<ChatMessageContent>
										{message.parts
											.filter(
												(part) => part.type === "text",
											)
											.map((part) => (
												<ChatMessageMarkdown
													key={part.type}
													content={part.text}
												/>
											))}
									</ChatMessageContent>

									{message.metadata?.threadData && (
										<ChatMessageThread>
											<ChatMessageAvatar>
												<ChatMessageAvatarImage
													src={
														message.metadata
															.threadData.member
															.image
													}
												/>
												<ChatMessageAvatarFallback>
													{message.metadata.threadData.member.name
														.charAt(0)
														.toUpperCase()}
												</ChatMessageAvatarFallback>
											</ChatMessageAvatar>
											<ChatMessageThreadReplyCount>
												{
													message.metadata.threadData
														.messageCount
												}{" "}
												replies
											</ChatMessageThreadReplyCount>
											<ChatMessageThreadTimestamp
												date={
													message.metadata.threadData
														.lastReply
												}
											/>
											<ChatMessageThreadAction />
										</ChatMessageThread>
									)}
								</ChatMessageContainer>
							</ChatMessage>
						);
					})}
				</ChatMessageAreaContent>
				<ChatMessageAreaScrollButton alignment="center" />
			</ChatMessageArea>
			<div className="px-2 py-4 max-w-2xl mx-auto w-full">
				<ChatInput
					onSubmit={handleSubmit}
					isStreaming={isLoading}
					onStop={stop}
				>
					<ChatInputEditor
						value={value}
						onChange={onChange}
						placeholder="Type a message..."
					/>
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" />
					</ChatInputGroupAddon>
				</ChatInput>
			</div>
		</div>
	);
}
