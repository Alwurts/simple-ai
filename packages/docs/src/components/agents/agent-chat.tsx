"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import type { AIUIMessage } from "@/registry/ai/messages";
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
import { useAgentViewer } from "./agent-viewer";

function AgentChat() {
	const { agentId, item } = useAgentViewer();
	const { messages, sendMessage, status, stop } = useChat<AIUIMessage>({
		id: `agent-${agentId}`,
		transport: new DefaultChatTransport({
			api: `/api/ai/agents/${agentId}/chat`,
		}),
	});

	const isLoading = status === "streaming" || status === "submitted";

	const meta = item?.meta as
		| {
				toolIds: string[];
				suggestions?: string[];
		  }
		| undefined;

	const suggestions = meta?.suggestions || [];

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsedValue) => {
			sendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

	return (
		<div className="flex flex-col h-full border rounded-lg overflow-hidden max-w-md mx-auto">
			<ChatMessageArea className="flex-1">
				<ChatMessageAreaContent>
					{messages.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center p-4">
							<div className="text-muted-foreground text-sm mb-4">
								Start a conversation with this agent...
							</div>
							{suggestions.length > 0 && (
								<div className="space-y-2 w-full max-w-sm">
									<div className="text-xs text-muted-foreground mb-2">
										Try asking:
									</div>
									<div className="flex flex-col gap-2">
										{suggestions
											.slice(0, 3)
											.map((suggestion) => (
												<Button
													key={suggestion}
													variant="outline"
													size="sm"
													className="text-left justify-start h-auto py-2 px-3 text-xs"
													onClick={() => {
														sendMessage({
															role: "user",
															parts: [
																{
																	type: "text",
																	text: suggestion,
																},
															],
														});
													}}
												>
													{suggestion}
												</Button>
											))}
									</div>
								</div>
							)}
						</div>
					) : (
						messages.map((message) => (
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
												(part) => part.type === "text",
											)
											.map((part, index) => (
												<ChatMessageMarkdown
													key={`${message.id}-text-${index}`}
													content={part.text}
												/>
											))}
									</ChatMessageContent>
								</ChatMessageContainer>
							</ChatMessage>
						))
					)}
				</ChatMessageAreaContent>
				<ChatMessageAreaScrollButton />
			</ChatMessageArea>
			<div className="border-t p-2">
				<ChatInput
					onSubmit={handleSubmit}
					value={value}
					onChange={onChange}
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
	);
}

export { AgentChat };
