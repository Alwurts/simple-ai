"use client";

import { Provider, useChat } from "@ai-sdk-tools/store";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import type { ComponentProps } from "react";
import { getAllChatsKey } from "@/hooks/query/use-chat";
import { cn, createId } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";

interface ChatProps extends ComponentProps<"div"> {
	id: string;
	initialMessages: AIUIMessage[];
	onNewChat?: (chatId: string) => void;
}

export function Chat({ id, initialMessages = [], ...props }: ChatProps) {
	return (
		<Provider key={id} initialMessages={initialMessages}>
			<ChatInner id={id} initialMessages={initialMessages} {...props} />
		</Provider>
	);
}

function ChatInner({ id, initialMessages, children, className, onNewChat, ...props }: ChatProps) {
	const queryClient = useQueryClient();

	useChat<AIUIMessage>({
		id,
		messages: initialMessages,
		transport: new DefaultChatTransport({
			api: "/api/chat/messages",
			prepareSendMessagesRequest({ messages, body }) {
				if (initialMessages.length === 0 && onNewChat) {
					onNewChat(id);
				}
				return {
					body: {
						...body,
						chatId: id,
						newMessage: messages[messages.length - 1],
					},
				};
			},
		}),
		generateId: () => createId("msg"),
		onFinish: () => {
			if (initialMessages.length === 0) {
				queryClient.invalidateQueries({ queryKey: getAllChatsKey() });
			}
		},
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
	});

	return (
		<div
			className={cn(
				"@container flex-1 flex h-full min-w-0 min-h-0 max-w-screen flex-col bg-background",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

// 2. The Header Primitives
export function ChatHeader({ className, children, ...props }: ComponentProps<"header">) {
	return (
		<header
			className={cn(
				"flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background px-4",
				className,
			)}
			{...props}
		>
			{children}
		</header>
	);
}

export function ChatHeaderTitle({ className, children, ...props }: ComponentProps<"h2">) {
	return (
		<h2 className={cn("text-sm font-medium truncate", className)} {...props}>
			{children}
		</h2>
	);
}

export function ChatHeaderActions({ className, children, ...props }: ComponentProps<"div">) {
	return (
		<div className={cn("flex items-center gap-1", className)} {...props}>
			{children}
		</div>
	);
}
