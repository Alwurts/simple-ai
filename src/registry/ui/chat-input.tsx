"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type React from "react";
import { useTextareaResize } from "../hooks/use-textarea-resize";

export interface ChatInputProps extends React.ComponentProps<typeof Textarea> {
	submitMessage?: () => void;
}

function ChatInput({
	submitMessage,
	value,
	onChange,
	className,
	...props
}: ChatInputProps) {
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

	const textareaRef = useTextareaResize(value);

	return (
		<Textarea
			ref={textareaRef}
			{...props}
			value={value}
			onChange={onChange}
			onKeyDown={handleKeyDown}
			className={cn("min-h-min max-h-[200px] resize-none", className)}
			rows={1}
		/>
	);
}

ChatInput.displayName = "ChatInput";

export { ChatInput };
