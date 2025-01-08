"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/registry/hooks/use-textarea-resize";
import type React from "react";

export interface ChatInputProps extends React.ComponentProps<typeof Textarea> {
	submitMessage?: () => void;
}

function ChatInput({
	submitMessage,
	value,
	className,
	...props
}: ChatInputProps) {
	const textareaRef = useTextareaResize(value);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!submitMessage) {
			return;
		}
		if (e.key === "Enter" && !e.shiftKey) {
			if (typeof value === "string" && value.length === 0) {
				return;
			}
			e.preventDefault();
			submitMessage();
		}
	};

	return (
		<Textarea
			ref={textareaRef}
			{...props}
			value={value}
			onKeyDown={handleKeyDown}
			className={cn(
				"min-h-[24px] max-h-[calc(75dvh)] resize-none overflow-hidden bg-muted",
				className,
			)}
			rows={2}
		/>
	);
}

ChatInput.displayName = "ChatInput";

export { ChatInput };
