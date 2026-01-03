"use client";

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store";
import type { JSONContent } from "@tiptap/react";
import { XIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AIUIMessage } from "@/types/ai";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "../ai-elements/chat-input";
import { Button } from "../ui/button";

export function ChatInputArea() {
	const { stop, sendMessage } = useChatActions<AIUIMessage>();
	const status = useChatStatus();

	const isLoading = status === "streaming" || status === "submitted";

	const handleSendMessage = useCallback(
		async (content: string) => {
			try {
				// Optimistic UI update for sidebar list if this is the first message
				// if (chatHelpers.messages.length === 0) {
				// 	setTimeout(() => {
				// 		queryClient.invalidateQueries({ queryKey: chatsKeysAll() });
				// 	}, 1000);
				// }

				return await sendMessage({
					role: "user",
					parts: [{ type: "text", text: content }],
				});
			} catch (error) {
				console.error("Failed to send message:", error);

				// Provide user-friendly error messages
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

	return (
		<div className="relative bottom-0 z-10 w-full bg-background pt-2">
			<div className="mx-auto w-full p-2 @[500px]:px-4 @[500px]:pb-4 md:max-w-3xl @[500px]:md:pb-6">
				<ChatInputComposed
					onSubmit={({ content }) => handleSendMessage(content)}
					isStreaming={isLoading}
					onStop={stop}
				/>
			</div>
		</div>
	);
}

interface ChatInputComposedProps {
	initialValue?: JSONContent;
	placeholder?: string;
	isStreaming?: boolean;
	onStop?: () => void;
	onSubmit: (params: { content: string }) => void;

	// Edit mode specific props
	isEditMode?: boolean;
	onCancelEdit?: () => void;
	className?: string;
}

function ChatInputComposed({
	initialValue,
	placeholder = "Type a message...",
	isStreaming,
	onStop,
	onSubmit,
	isEditMode,
	onCancelEdit,
	className,
}: ChatInputComposedProps) {
	const { value, onChange, handleSubmit } = useChatInput({
		initialValue,
		onSubmit: (parsed) => {
			onSubmit({
				content: parsed.content,
			});
		},
	});

	return (
		<ChatInput
			onSubmit={handleSubmit}
			isStreaming={isStreaming}
			onStop={onStop}
			className={cn(isEditMode && "border-primary/50 ring-1 ring-primary/20", className)}
		>
			<ChatInputEditor
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="min-h-[48px]" // Ensure consistent height
			/>
			<ChatInputGroupAddon align="block-end">
				{isEditMode && onCancelEdit && (
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={onCancelEdit}
						className="text-muted-foreground hover:text-foreground"
						title="Cancel edit"
					>
						<XIcon className="size-4" />
					</Button>
				)}
				<ChatInputSubmitButton className={cn(!isEditMode && "ml-auto")} />
			</ChatInputGroupAddon>
		</ChatInput>
	);
}
