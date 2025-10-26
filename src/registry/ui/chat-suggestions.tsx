"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ChatSuggestions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-2 px-2 py-2", className)}
			{...props}
		/>
	);
}

function ChatSuggestionsTitle({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"text-xs font-medium text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function ChatSuggestionsList({ className, ...props }: ComponentProps<"div">) {
	return <div className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

interface ChatSuggestionProps extends ComponentProps<typeof Button> {
	onSuggestionClick?: (suggestion: string) => void;
}

function ChatSuggestion({
	className,
	children,
	onSuggestionClick,
	onClick,
	...props
}: ChatSuggestionProps) {
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (onSuggestionClick && typeof children === "string") {
			onSuggestionClick(children);
		}
		onClick?.(e);
	};

	return (
		<Button
			variant="outline"
			size="sm"
			className={cn(
				"h-auto py-2 px-3 text-xs font-normal whitespace-normal text-left justify-start",
				"hover:bg-accent/50 hover:text-accent-foreground",
				"transition-colors",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{children}
		</Button>
	);
}

export {
	ChatSuggestions,
	ChatSuggestionsTitle,
	ChatSuggestionsList,
	ChatSuggestion,
};
