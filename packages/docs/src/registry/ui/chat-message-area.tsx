import { ChevronDown } from "lucide-react";
import { type ComponentProps, useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageAreaScrollButtonProps {
	alignment?: "left" | "center" | "right";
	className?: string;
}

export function ChatMessageAreaScrollButton({
	alignment = "center",
	className,
}: ChatMessageAreaScrollButtonProps) {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();

	const handleScrollToBottom = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	if (isAtBottom) {
		return null;
	}

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
				"absolute bottom-4 rounded-full shadow-lg hover:bg-secondary",
				alignmentClasses[alignment],
				className,
			)}
			onClick={handleScrollToBottom}
		>
			<ChevronDown className="h-4 w-4" />
		</Button>
	);
}

type ChatMessageAreaProps = ComponentProps<typeof StickToBottom>;

export function ChatMessageArea({ className, ...props }: ChatMessageAreaProps) {
	return (
		<StickToBottom
			className={cn("flex-1 relative h-full overflow-y-auto", className)}
			resize="smooth"
			initial="smooth"
			{...props}
		/>
	);
}

type ChatMessageAreaContentProps = ComponentProps<typeof StickToBottom.Content>;

export function ChatMessageAreaContent({
	className,
	...props
}: ChatMessageAreaContentProps) {
	return (
		<StickToBottom.Content
			className={cn("max-w-2xl mx-auto w-full h-full py-2", className)}
			{...props}
		/>
	);
}
