"use client";

import {
	useChatActions,
	useChatError,
	useChatId,
	useChatMessages,
	useChatStatus,
} from "@ai-sdk-tools/store";
import { isToolUIPart } from "ai";
import type { ComponentPropsWithoutRef } from "react";
import { memo, useCallback } from "react";
import { toast } from "sonner";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "@/components/ai-elements/chat-input";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { cn } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { ComposedTool } from "./composed-tool";
import { ResponseErrorMessage } from "./response-error-message";

function ChatMessages() {
	const chatId = useChatId();
	const status = useChatStatus();
	const messages = useChatMessages<AIUIMessage>();
	const isLoading = status === "streaming" || status === "submitted";

	if (!chatId) {
		return null;
	}

	if (messages.length === 0) {
		return null;
	}

	return (
		<>
			{messages.map((message) => {
				return (
					<Message key={message.id} from={message.role}>
						<div
							className={cn("flex w-full flex-col gap-2", message.role === "user" && "items-end")}
						>
							<MessageContent>
								{message.parts.map((part, partIndex) => {
									const isLastPart = partIndex === message.parts.length - 1;

									if (part.type === "text") {
										return (
											<MessageResponse
												key={`${message.id}-text-${partIndex}`}
												className="text-base"
											>
												{part.text}
											</MessageResponse>
										);
									}

									if (part.type === "reasoning") {
										return (
											<Reasoning
												key={`${message.id}-reasoning-${partIndex}`}
												className="my-2"
												isStreaming={isLoading && isLastPart}
												defaultOpen={false}
											>
												<ReasoningTrigger />
												<ReasoningContent>{part.text}</ReasoningContent>
											</Reasoning>
										);
									}

									if (isToolUIPart(part)) {
										return <ComposedTool key={part.toolCallId} part={part} />;
									}

									return null;
								})}
							</MessageContent>
						</div>
					</Message>
				);
			})}
		</>
	);
}

const ChatMessagesMemo = memo(ChatMessages);

type ChatContentProps = ComponentPropsWithoutRef<"div">;

function ChatContentInternal({ className, ...props }: ChatContentProps) {
	const messages = useChatMessages<AIUIMessage>();
	const { sendMessage, stop } = useChatActions<AIUIMessage>();
	const status = useChatStatus();
	const error = useChatError();
	const isLoading = status === "streaming" || status === "submitted";

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsedValue) => {
			handleSendMessage({
				role: "user",
				parts: [{ type: "text", text: parsedValue.content }],
			});
		},
	});

	const handleSendMessage = useCallback(
		async (message: Parameters<typeof sendMessage>[0]) => {
			try {
				return await sendMessage(message);
			} catch (error) {
				console.error("Failed to send message:", error);

				if (error instanceof Error) {
					if (error.message.includes("network") || error.message.includes("fetch")) {
						toast.error("Network error. Please check your connection and try again.");
					} else if (error.message.includes("rate limit") || error.message.includes("429")) {
						toast.error("Too many requests. Please wait a moment before trying again.");
					} else if (error.message.includes("timeout")) {
						toast.error("Request timed out. Please try again.");
					} else {
						toast.error(`Failed to send message: ${error.message}`);
					}
				} else {
					toast.error("An unexpected error occurred. Please try again.");
				}

				throw error;
			}
		},
		[sendMessage],
	);

	if (messages.length === 0) {
		return (
			<div className="flex-1 flex flex-col h-full items-center justify-center p-4">
				<div className="w-full max-w-2xl flex flex-col gap-8">
					<div className="text-center space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight">How can I help you today?</h1>
						<p className="text-muted-foreground">
							Start a new conversation by typing a message below.
						</p>
					</div>

					<ChatInput onSubmit={handleSubmit} isStreaming={isLoading} onStop={stop}>
						<ChatInputEditor value={value} onChange={onChange} placeholder="Type a message..." />
						<ChatInputGroupAddon align="block-end">
							<ChatInputSubmitButton className="ml-auto" />
						</ChatInputGroupAddon>
					</ChatInput>
				</div>
			</div>
		);
	}

	if (status === "error" || error) {
		return (
			<div className="flex h-full min-h-0 w-full flex-1 flex-col" {...props}>
				<div className="flex-1 flex items-center justify-center p-4">
					<ResponseErrorMessage />
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-1 flex-col" {...props}>
			<Conversation className="h-full flex-1 overflow-y-hidden">
				<ConversationContent className="container gap-2 mx-auto w-full pb-6 sm:max-w-2xl md:max-w-3xl">
					<ChatMessagesMemo />
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>

			<div className="relative bottom-4 z-10 w-full">
				<div className="mx-auto w-full p-2 @[500px]:px-4 @[500px]:pb-4 md:max-w-3xl @[500px]:md:pb-6">
					<ChatInput onSubmit={handleSubmit} isStreaming={isLoading} onStop={() => {}}>
						<ChatInputEditor value={value} onChange={onChange} placeholder="Type a message..." />
						<ChatInputGroupAddon align="block-end">
							<ChatInputSubmitButton className="ml-auto" />
						</ChatInputGroupAddon>
					</ChatInput>
				</div>
			</div>
		</div>
	);
}

export const ChatContent = memo(ChatContentInternal);
