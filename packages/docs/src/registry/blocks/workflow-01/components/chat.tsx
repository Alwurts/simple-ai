"use client";

import type { useChat } from "@ai-sdk/react";
import { Copy, MessagesSquare, RotateCcw, ThumbsUp } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import {
	AppHeader,
	AppHeaderIcon,
	AppHeaderSeparator,
	AppHeaderTitle,
} from "@/registry/blocks/workflow-01/components/app-header";
import {
	NodeExecutionStatus,
	NodeExecutionStatusBadge,
	NodeExecutionStatusContent,
	NodeExecutionStatusError,
	NodeExecutionStatusHeader,
	NodeExecutionStatusIcon,
	NodeExecutionStatusType,
} from "@/registry/blocks/workflow-01/components/node-execution";
import { useWorkflow } from "@/registry/blocks/workflow-01/hooks/use-workflow";
import { getTemplateById } from "@/registry/blocks/workflow-01/lib/templates";
import type { WorkflowUIMessage } from "@/registry/blocks/workflow-01/types/messages";
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

interface ChatHeaderProps {
	onReset?: () => void;
}

function ChatHeader({ onReset }: ChatHeaderProps) {
	return (
		<AppHeader>
			<AppHeaderIcon className="hidden md:flex">
				<MessagesSquare />
			</AppHeaderIcon>
			<AppHeaderSeparator className="hidden md:block" />
			<AppHeaderTitle>Chat</AppHeaderTitle>
			{onReset && (
				<Button
					variant="outline"
					size="icon-sm"
					onClick={onReset}
					className="ml-auto"
					title="Reset chat messages"
				>
					<RotateCcw />
				</Button>
			)}
		</AppHeader>
	);
}

type ReturnOfUseChat = ReturnType<typeof useChat<WorkflowUIMessage>>;

interface ChatProps extends ComponentPropsWithoutRef<"div"> {
	messages: WorkflowUIMessage[];
	sendMessage: ReturnOfUseChat["sendMessage"];
	status: ReturnOfUseChat["status"];
	stop: ReturnOfUseChat["stop"];
	setMessages: ReturnOfUseChat["setMessages"];
	selectedTemplateId?: string;
}

export function Chat({
	className,
	messages,
	sendMessage,
	status,
	stop,
	setMessages,
	selectedTemplateId,
	...props
}: ChatProps) {
	const getWorkflowData = useWorkflow(store => store.getWorkflowData);
	const resetNodeStatuses = useWorkflow(store => store.resetNodeStatuses);
	const validationState = useWorkflow(store => store.validationState);

	const isLoading = status === "streaming" || status === "submitted";
	const hasValidationErrors = !validationState.valid;
	const isDisabled = hasValidationErrors;

	const currentTemplate = selectedTemplateId
		? getTemplateById(selectedTemplateId)
		: undefined;

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: parsedValue => {
			resetNodeStatuses();

			const workflowData = getWorkflowData();

			sendMessage(
				{
					role: "user",
					parts: [{ type: "text", text: parsedValue.content }],
				},
				{
					body: {
						nodes: workflowData.nodes,
						edges: workflowData.edges,
					},
				},
			);
		},
	});

	const handleSuggestionClick = (suggestion: string) => {
		resetNodeStatuses();

		const workflowData = getWorkflowData();

		sendMessage(
			{
				role: "user",
				parts: [{ type: "text", text: suggestion }],
			},
			{
				body: {
					nodes: workflowData.nodes,
					edges: workflowData.edges,
				},
			},
		);
	};

	const resetMessages = () => {
		stop();
		setMessages([]);
		resetNodeStatuses();
	};

	return (
		<div
			className="flex-1 flex flex-col overflow-y-auto bg-background"
			{...props}
		>
			<ChatHeader onReset={resetMessages} />
			<ChatMessageArea className="px-2">
				<ChatMessageAreaContent className="pt-4">
					{messages.length === 0 ? (
						<NoChatMessages
							template={currentTemplate}
							onSuggestionClick={handleSuggestionClick}
						/>
					) : (
						messages.map(message => {
							const userName = message.role === "user" ? "You" : "Assistant";
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
											<ChatMessageAuthor>{userName}</ChatMessageAuthor>
											<ChatMessageTimestamp createdAt={new Date()} />
										</ChatMessageHeader>

										<ChatMessageContent className="gap-3">
											{message.parts.map((part, index) => {
												switch (part.type) {
													case "text": {
														return (
															<ChatMessageMarkdown
																key={`text-${message.id}-${index}`}
																content={part.text}
															/>
														);
													}

													case "reasoning": {
														return (
															<Reasoning
																key={`reasoning-${message.id}-${index}`}
																content={part.text}
																isLastPart={index === message.parts.length - 1}
															/>
														);
													}

													case "data-node-execution-status": {
														return (
															<NodeExecutionStatus
																key={`status-${message.id}-${index}`}
															>
																<NodeExecutionStatusHeader>
																	<NodeExecutionStatusIcon
																		status={part.data.status}
																	/>
																	<NodeExecutionStatusContent>
																		<NodeExecutionStatusType
																			nodeType={part.data.nodeType}
																		/>
																		<NodeExecutionStatusBadge
																			status={part.data.status}
																		/>
																	</NodeExecutionStatusContent>
																</NodeExecutionStatusHeader>
																{part.data.error && (
																	<NodeExecutionStatusError>
																		{part.data.error}
																	</NodeExecutionStatusError>
																)}
															</NodeExecutionStatus>
														);
													}
												}

												if (
													(part.type.startsWith("tool-") ||
														part.type === "dynamic-tool") &&
													"toolCallId" in part
												) {
													let input: unknown | undefined;
													let output: unknown | undefined;
													let error: string | undefined;

													if (part.state === "output-error") {
														error = part.errorText;
														output = part.output;
													}

													if (
														part.state === "input-streaming" ||
														part.state === "output-error"
													) {
														if ("rawInput" in part && part.rawInput != null) {
															input = part.rawInput;
														} else if ("input" in part && part.input != null) {
															input = part.input;
														}
													}

													if (part.state === "input-available") {
														input = part.input;
													}

													if (part.state === "output-available") {
														input = part.input;
														output = part.output;
													}

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
																	isError={!!error}
																/>
															</ToolInvocationHeader>
															{(input !== undefined ||
																output !== undefined) && (
																<ToolInvocationContentCollapsible>
																	{input !== undefined && (
																		<ToolInvocationRawData
																			data={input}
																			title="Arguments"
																		/>
																	)}
																	{output !== undefined && (
																		<ToolInvocationRawData
																			data={output}
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
							);
						})
					)}
				</ChatMessageAreaContent>
				<ChatMessageAreaScrollButton alignment="center" />
			</ChatMessageArea>
			<div className="px-4 py-4 max-w-2xl mx-auto w-full">
				{hasValidationErrors && (
					<div className="mb-2 p-2 bg-red-50 border border-destructive rounded text-xs text-destructive">
						Fix validation errors before running the workflow
					</div>
				)}
				<ChatInput
					onSubmit={handleSubmit}
					isStreaming={isLoading}
					onStop={stop}
					disabled={isDisabled}
				>
					<ChatInputEditor
						value={value}
						onChange={onChange}
						placeholder={
							hasValidationErrors
								? "Fix validation errors first..."
								: "Type a message..."
						}
						disabled={isDisabled}
					/>
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" disabled={isDisabled} />
					</ChatInputGroupAddon>
				</ChatInput>
			</div>
		</div>
	);
}

function NoChatMessages({
	template,
	onSuggestionClick,
}: {
	template?: ReturnType<typeof getTemplateById>;
	onSuggestionClick: (suggestion: string) => void;
}) {
	if (!template || template.suggestions.length === 0) {
		return (
			<div className="flex flex-col gap-2 p-2 items-center justify-center h-full">
				<p className="text-muted-foreground text-lg">No chat messages</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-2 p-2 justify-end items-center h-full">
			<ChatSuggestions>
				<ChatSuggestionsHeader>
					<ChatSuggestionsTitle>Try these prompts:</ChatSuggestionsTitle>
				</ChatSuggestionsHeader>
				<ChatSuggestionsContent>
					{template.suggestions.map(suggestion => (
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
