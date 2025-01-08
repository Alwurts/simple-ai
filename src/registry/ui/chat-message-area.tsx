import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "@/registry/hooks/use-scroll-to-bottom";
import type { ReactNode } from "react";

interface ChatMessageAreaProps {
	children: ReactNode;
	className?: string;
}

export function ChatMessageArea({ children, className }: ChatMessageAreaProps) {
	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	return (
		<ScrollArea className="flex-1">
			<div ref={messagesContainerRef}>
				<div className={className}>{children}</div>
				<div
					ref={messagesEndRef}
					className="shrink-0 min-w-[24px] min-h-[4px]"
				/>
			</div>
		</ScrollArea>
	);
}

ChatMessageArea.displayName = "ChatMessageArea";
