"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ChatSuggestions({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-2.5 px-2 py-2", className)}
			{...props}
		/>
	);
}

function ChatSuggestionsHeader({ className, ...props }: ComponentProps<"div">) {
	return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

function ChatSuggestionsTitle({ className, ...props }: ComponentProps<"p">) {
	return (
		<p
			className={cn(
				"text-sm font-medium text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function ChatSuggestionsDescription({
	className,
	...props
}: ComponentProps<"p">) {
	return (
		<p
			className={cn("text-xs text-muted-foreground/80", className)}
			{...props}
		/>
	);
}

function ChatSuggestionsContent({
	className,
	...props
}: ComponentProps<"div">) {
	return <div className={cn("flex flex-wrap gap-2", className)} {...props} />;
}

function ChatSuggestion({
	className,
	...props
}: ComponentProps<typeof Button>) {
	return (
		<Button
			variant="outline"
			size="default"
			className={cn(
				"h-auto py-2 px-3 text-sm font-normal whitespace-normal text-left justify-start",
				"hover:bg-accent/50 hover:text-accent-foreground",
				"transition-colors",
				className,
			)}
			{...props}
		/>
	);
}

export {
	ChatSuggestions,
	ChatSuggestionsHeader,
	ChatSuggestionsTitle,
	ChatSuggestionsDescription,
	ChatSuggestionsContent,
	ChatSuggestion,
};
