import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { SparklesIcon } from "lucide-react";
import { memo } from "react";

interface ChatMessageProps {
	message: Message;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
	return (
		<div
			className={cn(
				"flex gap-4 w-full px-4",
				message.role === "user" ? "ml-auto max-w-2xl w-fit" : "max-w-3xl",
			)}
		>
			{message.role !== "user" && (
				<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-transparent">
					<div className="translate-y-px">
						<SparklesIcon className="size-4" />
					</div>
				</div>
			)}
			<div
				className={cn(
					"flex flex-col",
					message.role === "user" &&
						"bg-primary text-primary-foreground px-3 py-2 rounded-xl",
				)}
			>
				<Markdown id={message.id} content={message.content} />
			</div>
		</div>
	);
});

ChatMessage.displayName = "ChatMessage";
