"use client";

import { Textarea } from "@/components/ui/textarea";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { cn } from "@/lib/utils";
import type React from "react";

interface ChatInputProps extends React.ComponentProps<typeof Textarea> {
	submitMessage?: () => void;
}

export function ChatInput({
	// Custom props
	submitMessage,
	// Textarea props
	value,
	onChange,
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
			onChange={onChange}
			onKeyDown={handleKeyDown}
			className={cn(
				"min-h-min max-h-[200px] resize-none overflow-hidden",
				className,
			)}
			rows={2}
		/>
	);
}

ChatInput.displayName = "ChatInput";
