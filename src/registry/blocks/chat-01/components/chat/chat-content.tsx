"use client";

import type { useChat } from "@ai-sdk/react";
import { Copy, ThumbsUp } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import type { AIUIMessage } from "@/registry/blocks/chat-01/types/ai-messages";
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
import {
	ChatSuggestion,
	ChatSuggestions,
	ChatSuggestionsContent,
	ChatSuggestionsHeader,
	ChatSuggestionsTitle,
} from "@/registry/ui/chat-suggestions";
import { Reasoning } from "@/registry/ui/reasoning";
import {
	ToolInvocation,
	ToolInvocationContentCollapsible,
	ToolInvocationHeader,
	ToolInvocationName,
	ToolInvocationRawData,
} from "@/registry/ui/tool-invocation";

export const DEFAULT_CHAT_SUGGESTIONS = [
	"Hello! Can you help me with a coding question?",
	"Tell me about your capabilities and what you can do",
	"I need help organizing my project management workflow",
	"Can you explain a complex topic in simple terms?",
];

function NoChatMessages({
	onSuggestionClick,
}: {
	onSuggestionClick: (suggestion: string) => void;
}) {
	return (
		<div className="flex flex-col gap-2 p-2 justify-end items-center h-full">
			<ChatSuggestions>
				<ChatSuggestionsHeader>
					<ChatSuggestionsTitle>
						Try these prompts:
					</ChatSuggestionsTitle>
				</ChatSuggestionsHeader>
				<ChatSuggestionsContent>
					{DEFAULT_CHAT_SUGGESTIONS.map((suggestion) => (
						<ChatSuggestion
							key={suggestion}
							onClick={() => onSuggestionClick(suggestion)}
						>
							{suggestion}
						</ChatSuggestion>
					))}
				</ChatSuggestionsContent>
			</ChatSuggestions>
		</div>
	);
}

type ReturnOfUseChat = ReturnType<typeof useChat<AIUIMessage>>;

export function ChatContent({
	className,
	messages,
	sendMessage,
	status,
	stop,
	...props
}: ComponentPropsWithoutRef<"div"> & {
	messages: ReturnOfUseChat["messages"];
	sendMessage: ReturnOfUseChat["sendMessage"];
	status: ReturnOfUseChat["status"];
	stop: ReturnOfUseChat["stop"];
}) {
	const isLoading = status === "streaming" || status === "submitted";

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
		<div className="flex-1 flex flex-col overflow-y-auto" {...props}>
			<ChatMessageArea>
				<ChatMessageAreaContent className="pt-6">
					{messages.length === 0 ? (
						<NoChatMessages
							onSuggestionClick={(suggestion) => {
								sendMessage({
									role: "user",
									parts: [{ type: "text", text: suggestion }],
								});
							}}
						/>
					) : (
						messages.map((message) => {
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
										{message.role === "user" ? (
											<ChatMessageAvatarUserIcon />
										) : (
											<ChatMessageAvatarAssistantIcon />
										)}
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
											{message.parts.map(
												(part, index) => {
													if (part.type === "text") {
														return (
															<ChatMessageMarkdown
																key={`${message.id}-text-${index}`}
																content={
																	part.text
																}
															/>
														);
													}

													if (
														part.type ===
														"reasoning"
													) {
														return (
															<Reasoning
																key={`reasoning-${message.id}-${index}`}
																content={
																	part.text
																}
																isLastPart={
																	index ===
																	message
																		.parts
																		.length -
																		1
																}
															/>
														);
													}

													if (
														part.type.startsWith(
															"tool-",
														)
													) {
														if (
															!(
																"toolCallId" in
																part
															) ||
															!("state" in part)
														) {
															return null;
														}

														const toolPart =
															part as {
																type: string;
																toolCallId: string;
																state:
																	| "input-streaming"
																	| "input-available"
																	| "output-available"
																	| "output-error";
																input?: unknown;
																output?: unknown;
																errorText?: string;
															};

														const hasInput =
															toolPart.input !=
																null &&
															toolPart.input !==
																undefined;
														const hasOutput =
															toolPart.output !=
																null &&
															toolPart.output !==
																undefined;

														const toolName =
															toolPart.type.slice(
																5,
															);
														return (
															<ToolInvocation
																key={
																	toolPart.toolCallId
																}
																className="w-full"
															>
																<ToolInvocationHeader>
																	<ToolInvocationName
																		name={
																			toolName
																		}
																		type={
																			toolPart.state
																		}
																		isError={
																			toolPart.state ===
																			"output-error"
																		}
																	/>
																</ToolInvocationHeader>
																{(hasInput ||
																	hasOutput ||
																	toolPart.errorText) && (
																	<ToolInvocationContentCollapsible>
																		{hasInput && (
																			<ToolInvocationRawData
																				data={
																					toolPart.input
																				}
																				title="Arguments"
																			/>
																		)}
																		{toolPart.errorText && (
																			<ToolInvocationRawData
																				data={{
																					error: toolPart.errorText,
																				}}
																				title="Error"
																			/>
																		)}
																		{hasOutput && (
																			<ToolInvocationRawData
																				data={
																					toolPart.output
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
												},
											)}
										</ChatMessageContent>
									</ChatMessageContainer>
								</ChatMessage>
							);
						})
					)}
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
