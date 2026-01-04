"use client";

import { useChatError, useChatMessages, useChatStatus } from "@ai-sdk-tools/store";
import { isToolUIPart } from "ai";
import { memo } from "react";
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { LoadSkillTool } from "@/components/tools/load-skill-tool";
import { cn } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import { ChatErrorMessage } from "./chat-error-message";
import { ComposedTool } from "./composed-tool";
import { ChatMessageActions } from "./message-actions";

function ChatMessageListInternal({ className }: { className?: string }) {
	const status = useChatStatus();
	const messages = useChatMessages<AIUIMessage>();
	const error = useChatError();
	const isLoading = status === "streaming" || status === "submitted";

	if (status === "error" || error) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<ChatErrorMessage />
			</div>
		);
	}

	if (messages.length === 0) {
		return <ConversationEmptyState />;
	}

	return (
		<Conversation className={cn("h-full flex-1 overflow-y-hidden", className)}>
			<ConversationContent className="container gap-2 mx-auto w-full pb-6 sm:max-w-2xl md:max-w-3xl">
				{messages.map((message) => {
					return (
						<Message key={message.id} from={message.role}>
							<div
								className={cn("flex w-full flex-col gap-2", message.role === "user" && "items-end")}
							>
								<MessageContent className="w-full">
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
													defaultOpen={true}
												>
													<ReasoningTrigger />
													<ReasoningContent>{part.text}</ReasoningContent>
												</Reasoning>
											);
										}

										if (part.type === "tool-load-skill") {
											return (
												<LoadSkillTool
													key={`${message.id}-tool-load-skill-${partIndex}`}
													part={part}
												/>
											);
										}

										if (part.type === "dynamic-tool" || isToolUIPart(part)) {
											return <ComposedTool key={`${message.id}-tool-${partIndex}`} part={part} />;
										}
										return null;
									})}
								</MessageContent>

								<ChatMessageActions messageId={message.id} isLoading={isLoading} />
							</div>
						</Message>
					);
				})}
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
}

export const ChatMessages = memo(ChatMessageListInternal);
