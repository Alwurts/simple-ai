import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScrollToBottom } from "@/registry/hooks/use-scroll-to-bottom";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type ScrollButtonAlignment = "none" | "left" | "center" | "right";

interface ScrollButtonProps {
	onClick: () => void;
	alignment?: Exclude<ScrollButtonAlignment, "none">;
	className?: string;
}

export function ScrollButton({
	onClick,
	alignment = "right",
	className,
}: ScrollButtonProps) {
	const alignmentClasses = {
		left: "left-4",
		center: "left-1/2 -translate-x-1/2",
		right: "right-4",
	};

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"absolute bottom-4 rounded-full shadow-lg",
				alignmentClasses[alignment],
				className,
			)}
			onClick={onClick}
		>
			<ChevronDown className="h-4 w-4" />
		</Button>
	);
}

interface ChatMessageAreaProps {
	children: ReactNode;
	className?: string;
	scrollButtonAlignment?: ScrollButtonAlignment;
}

export function ChatMessageArea({
	children,
	className,
	scrollButtonAlignment = "right",
}: ChatMessageAreaProps) {
	const [
		messagesContainerRef,
		messagesEndRef,
		showScrollButton,
		scrollToBottom,
	] = useScrollToBottom<HTMLDivElement>();

	return (
		<ScrollArea className="flex-1 relative">
			<div ref={messagesContainerRef}>
				<div className={className}>{children}</div>
				<div
					ref={messagesEndRef}
					className="shrink-0 min-w-[24px] min-h-[4px]"
				/>
			</div>
			{showScrollButton && scrollButtonAlignment !== "none" && (
				<ScrollButton
					onClick={scrollToBottom}
					alignment={scrollButtonAlignment}
				/>
			)}
		</ScrollArea>
	);
}

ChatMessageArea.displayName = "ChatMessageArea";
