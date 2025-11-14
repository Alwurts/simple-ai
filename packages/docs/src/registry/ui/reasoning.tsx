"use client";

import { Brain } from "lucide-react";

import { useMemo, useState } from "react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { MarkdownContent } from "@/registry/ui/markdown-content";

/**
 * Parses reasoning content to extract title and content.
 * Supports formats like:
 * - "**Title**\n\nContent"
 * - "# Title\n\nContent"
 * - "Title\n\nContent" (fallback for plain text with blank line)
 * - Plain text (returns as content with no title)
 */
function parseReasoningContent(text: string): {
	title?: string;
	content: string;
} {
	if (!text || text.trim() === "") {
		return { title: undefined, content: "" };
	}

	const trimmed = text.trim();

	// Define matchers for explicit title formats
	const matchers = [
		{
			// Check for markdown bold title format (**Title**)
			pattern: /^\*\*(.+?)\*\*(?:\n\n|\n|$)/,
		},
		{
			// Check for markdown heading format
			pattern: /^#+\s+(.+?)(?:\n\n|\n|$)/,
		},
	];

	// Try each matcher in order
	for (const matcher of matchers) {
		const match = trimmed.match(matcher.pattern);
		if (match) {
			const title = match[1].trim();
			const content = trimmed.slice(match[0].length).trim();
			return { title, content: content || trimmed };
		}
	}

	// Fallback: Check for title/content split (first line as title if followed by blank line)
	const lines = trimmed.split("\n");
	if (lines.length > 1 && lines[1].trim() === "") {
		const title = lines[0].trim();
		const content = lines.slice(2).join("\n").trim();
		return { title, content: content || trimmed };
	}

	// No title found, return content only
	return { content: trimmed };
}

interface ReasoningProps {
	content: string;
	isLastPart: boolean;
}

export function Reasoning({ content, isLastPart }: ReasoningProps) {
	const [isOpen, setIsOpen] = useState(false);

	const parsedContent = useMemo(
		() => parseReasoningContent(content),
		[content],
	);
	const title = parsedContent.title;
	const finalContent = parsedContent.content;

	if (isLastPart) {
		return (
			<div className="flex flex-col items-start gap-4 my-2 ml-2 text-muted-foreground">
				<div className="flex items-center gap-2 text-sm">
					<Brain className="size-4" />
					{title ?? "Thinking..."}
				</div>

				{finalContent.trim() !== "" && (
					<div className="text-sm">
						<MarkdownContent content={finalContent} />
					</div>
				)}
			</div>
		);
	}

	if (finalContent.trim() === "") {
		return (
			<div className="my-3 ml-2">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Brain className="size-4" />
					<span className="flex-1 break-all">
						{title ?? "Finished thinking"}
					</span>
				</div>
			</div>
		);
	}

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className="my-3 ml-2">
				<CollapsibleTrigger className="flex items-center gap-2 text-sm hover:text-foreground transition-colors cursor-pointer">
					<Brain className="size-4" />
					<span className="flex-1 break-all">
						{title ?? "Finished thinking"}
					</span>
					<span className="text-xs opacity-70 ml-2 flex-shrink-0">
						{isOpen ? "collapse" : "expand"}
					</span>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className="text-sm text-muted-foreground mt-4">
						<MarkdownContent content={finalContent} />
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
