"use client";

import type { UIMessage } from "@ai-sdk/react";
import type { InferUITools } from "ai";
import { tool } from "ai";
import z from "zod";
import {
	ChatMessage,
	ChatMessageAuthor,
	ChatMessageAvatar,
	ChatMessageAvatarFallback,
	ChatMessageAvatarImage,
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
import {
	ToolInvocation,
	ToolInvocationContentCollapsible,
	ToolInvocationHeader,
	ToolInvocationName,
	ToolInvocationRawData,
} from "@/registry/ui/tool-invocation";

const searchDatabaseTool = tool({
	name: "search-database",
	description: "Search the database for information",
	inputSchema: z.object({
		query: z.string(),
	}),
	outputSchema: z.string(),
	execute: () => {
		return "Result of searching the database";
	},
});

const toolSet = {
	"search-database": searchDatabaseTool,
};

const messages: Array<
	UIMessage<
		{
			member: {
				image: string;
				name: string;
			};
		},
		never,
		InferUITools<typeof toolSet>
	>
> = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Can you search for information about magical forests?",
			},
		],
		role: "user",
		metadata: {
			member: {
				image: "/avatar-1.png",
				name: "You",
			},
		},
	},
	{
		id: "2",
		parts: [
			{
				type: "tool-search-database",
				toolCallId: "search-tool-1",
				state: "output-available",
				input: {
					query: "magical forest stories",
				},
				output: "Found several stories about magical forests, including 'The Whispering Woods' - a tale about a magical forest where trees can talk and animals sing beautiful songs. The story follows Luna, a young fox with silver fur who can speak with ancient trees.",
			},
			{
				type: "text",
				text: "I found some great information! There's a wonderful story called 'The Whispering Woods' about a magical forest where trees can talk and animals sing. The main character is Luna, a young fox with silver fur who has the special ability to communicate with ancient trees.",
			},
		],
		role: "assistant",
		metadata: {
			member: {
				image: "/avatar-2.png",
				name: "Assistant",
			},
		},
	},
];

export default function ChatMessageAreaDemo() {
	return (
		<ChatMessageArea>
			<ChatMessageAreaContent>
				{messages.map((message) => (
					<ChatMessage key={message.id}>
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
									{message.metadata?.member.name}
								</ChatMessageAuthor>
								<ChatMessageTimestamp createdAt={new Date()} />
							</ChatMessageHeader>

							<ChatMessageContent>
								{message.parts.map((part) => {
									if (part.type === "text") {
										return (
											<ChatMessageMarkdown
												key={`${message.id}-text-${part.text.slice(0, 20)}`}
												content={part.text}
											/>
										);
									}
									if (part.type === "tool-search-database") {
										const hasInput =
											part.input != null &&
											part.input !== undefined;
										const hasOutput =
											part.output != null &&
											part.output !== undefined;

										const toolName = part.type.slice(5);
										return (
											<ToolInvocation
												key={part.toolCallId}
												className="w-full"
											>
												<ToolInvocationHeader>
													<ToolInvocationName
														name={toolName}
														type={part.state}
														isError={
															part.state ===
															"output-error"
														}
													/>
												</ToolInvocationHeader>
												{(hasInput ||
													hasOutput ||
													part.errorText) && (
													<ToolInvocationContentCollapsible>
														{hasInput && (
															<ToolInvocationRawData
																data={
																	part.input
																}
																title="Arguments"
															/>
														)}
														{part.errorText && (
															<ToolInvocationRawData
																data={{
																	error: part.errorText,
																}}
																title="Error"
															/>
														)}
														{hasOutput && (
															<ToolInvocationRawData
																data={
																	part.output
																}
																title="Result"
															/>
														)}
													</ToolInvocationContentCollapsible>
												)}
											</ToolInvocation>
										);
									}

									return null;
								})}
							</ChatMessageContent>
						</ChatMessageContainer>
					</ChatMessage>
				))}
			</ChatMessageAreaContent>
			<ChatMessageAreaScrollButton />
		</ChatMessageArea>
	);
}
