import { ChevronDown } from "lucide-react";
import { type ComponentProps, useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageAreaScrollButtonProps {
	alignment?: "left" | "center" | "right";
	className?: string;
}

export function MessageAreaScrollButton({
	alignment = "center",
	className,
}: MessageAreaScrollButtonProps) {
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

type MessageAreaProps = ComponentProps<typeof StickToBottom>;

export function MessageArea({ className, ...props }: MessageAreaProps) {
	return (
		<StickToBottom
			className={cn("flex-1 relative h-full overflow-y-auto", className)}
			resize="smooth"
			initial="smooth"
			{...props}
		/>
	);
}

type MessageAreaContentProps = ComponentProps<typeof StickToBottom.Content>;

export function MessageAreaContent({
	className,
	...props
}: MessageAreaContentProps) {
	return (
		<StickToBottom.Content
			className={cn("max-w-2xl mx-auto w-full py-2", className)}
			{...props}
		/>
	);
}
