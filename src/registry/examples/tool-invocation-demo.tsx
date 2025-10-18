"use client";

import type { UIMessage } from "@ai-sdk/react";
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

const messages: UIMessage<{
	member: {
		image: string;
		name: string;
	};
}>[] = [
	{
		id: "1",
		parts: [
			{
				type: "text",
				text: "Can you tell me a story? Maybe something about a magical forest?",
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
				type: "text",
				text: "Of course! I'd love to tell you a story about the Whispering Woods. Would you like to hear it?",
			},
			{
				type: "tool-invocation",
				toolCallId: "tool-invocation-1",
				state: "output-available",
				input: {
					query: "Can you tell me a story about the Whispering Woods?",
				},
				output: {
					response:
						"The Whispering Woods is a magical forest where the trees can talk and the animals can sing.",
				},
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
	{
		id: "3",
		parts: [
			{
				type: "text",
				text: "Yes, please! I'm excited to hear it!",
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
		id: "4",
		parts: [
			{
				type: "text",
				text: "Deep in the heart of the Whispering Woods, there lived a young fox named Luna with fur as silver as moonlight. Unlike other foxes, Luna had the magical ability to speak with the ancient trees that surrounded her home.",
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
	{
		id: "5",
		parts: [
			{
				type: "text",
				text: "One day, Luna discovered that the oldest tree in the forest had fallen silent. This was very unusual, as this particular oak tree loved telling stories about the forest's history. Concerned, Luna decided to investigate.",
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
	{
		id: "6",
		parts: [
			{
				type: "text",
				text: "Oh no! What happened to the old oak tree?",
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
		id: "7",
		parts: [
			{
				type: "text",
				text: "As Luna approached the ancient oak, she noticed something glowing at its roots - a tiny crystal that pulsed with a soft blue light. The tree had been protecting this crystal for centuries, and now it was losing its power.",
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
	{
		id: "8",
		parts: [
			{
				type: "text",
				text: "Luna knew she had to help. She gathered dewdrops from spider webs at dawn, collected starlight in flower petals at night, and asked the wind to share its oldest songs. With these magical ingredients, she restored the crystal's power.",
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
	{
		id: "9",
		parts: [
			{
				type: "text",
				text: "Did it work? Did the old oak tree start speaking again?",
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
		id: "10",
		parts: [
			{
				type: "text",
				text: "Yes! The moment the crystal began glowing brightly again, the old oak's leaves rustled with joy, and its deep, wise voice returned. It thanked Luna for her help and shared even more wonderful stories about the forest's ancient magic.",
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
	{
		id: "11",
		parts: [
			{
				type: "text",
				text: "From that day forward, Luna became known as the Guardian of the Whispering Woods, and she made sure to visit the old oak tree every day to hear its wonderful tales.",
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
	{
		id: "12",
		parts: [
			{
				type: "text",
				text: "That was such a beautiful story! I loved how Luna helped save the old oak tree's voice.",
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
		id: "13",
		parts: [
			{
				type: "text",
				text: "I'm glad you enjoyed it! The story teaches us that even the smallest acts of kindness can help preserve the magic in our world.",
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
												key={part.type}
												content={part.text}
											/>
										);
									}
									if (part.type === "tool-invocation") {
										const hasInput =
											"input" in part &&
											part.input != null;
										const hasOutput =
											"output" in part &&
											part.output != null;

										const toolName =
											"toolName" in part
												? part.toolName
												: part.type.slice(5);
										return (
											<ToolInvocation
												key={part.toolCallId}
												className="w-full"
											>
												<ToolInvocationHeader>
													<ToolInvocationName
														name={`Used ${toolName}`}
														type={part.state}
														isError={
															part.state ===
															"output-error"
														}
													/>
												</ToolInvocationHeader>
												{(hasInput || hasOutput) && (
													<ToolInvocationContentCollapsible>
														{hasInput && (
															<ToolInvocationRawData
																data={
																	part.input
																}
																title="Arguments"
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
