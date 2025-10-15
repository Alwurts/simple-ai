"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { type ComponentPropsWithoutRef, useState } from "react";
import { useTrackEvent } from "@/lib/events";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	type ChatInputValue,
} from "@/registry/ui/chat-input-tip";
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
				text: "Hi! I need help organizing my project management workflow. Can you guide me through some best practices?",
			},
		],
		role: "user",
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
	},
];

// Helper function to extract plain text from JSONContent
function extractTextFromJSON(json: ChatInputValue): string {
	if (!json.content) {
		return "";
	}
	let text = "";
	for (const item of json.content) {
		if (item.type === "text" && item.text) {
			text += item.text;
		} else if (item.type === "paragraph" && item.content) {
			text += extractTextFromJSON({ type: "doc", content: item.content });
		} else if (item.content) {
			text += extractTextFromJSON({ type: "doc", content: item.content });
		}
	}
	return text;
}

export function Chat({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	const [input, setInput] = useState<ChatInputValue>({
		type: "doc",
		content: [],
	});

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

	const handleSubmitMessage = () => {
		if (isLoading) {
			return;
		}
		const text = extractTextFromJSON(input).trim();
		if (text.length === 0) {
			return;
		}
		sendMessage({ role: "user", parts: [{ type: "text", text }] });
		setInput({ type: "doc", content: [] });
	};

	return (
		<div className="flex-1 flex flex-col h-full overflow-y-auto" {...props}>
			<MessageArea>
				<MessageAreaContent>
					{messages.map((message) => {
						if (message.role !== "user") {
							return (
								<ChatMessage key={message.id} id={message.id}>
									<ChatMessageAvatar />
									{message.parts
										.filter((part) => part.type === "text")
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
									.filter((part) => part.type === "text")
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
				<MessageAreaScrollButton alignment="center" />
			</MessageArea>
			<div className="px-2 py-4 max-w-2xl mx-auto w-full">
				<ChatInput onSubmit={handleSubmitMessage} isStreaming={isLoading} onStop={stop}>
					<ChatInputEditor
						value={input}
						onChange={setInput}
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
