"use client";

import { Provider, useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import type { ComponentPropsWithoutRef } from "react";
import { memo } from "react";
import { ChatContent } from "@/components/chat/chat-content";
import { cn } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";

type ChatMainProps = ComponentPropsWithoutRef<"div"> & {
	id: string;
};

function ChatMainInternal({ id, className, ...props }: ChatMainProps) {
	useChat<AIUIMessage>({
		id,
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});

	return (
		<div
			className={cn(
				"@container flex-1 flex h-full min-w-0 min-h-0 max-w-screen flex-col bg-background",
				className,
			)}
			{...props}
		>
			<ChatContent />
		</div>
	);
}

function ChatMainWithProvider({ id, ...props }: ChatMainProps) {
	return (
		<Provider key={id}>
			<ChatMainInternal id={id} {...props} />
		</Provider>
	);
}

export const ChatMain = memo(ChatMainWithProvider);
