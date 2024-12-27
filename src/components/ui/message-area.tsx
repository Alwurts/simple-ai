import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import type { ReactNode } from "react";

interface MessageAreaProps {
	children: ReactNode;
	className?: string;
}

export function MessageArea({ children, className }: MessageAreaProps) {
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

MessageArea.displayName = "MessageArea";
