"use client";

import { useMessageById } from "@ai-sdk-tools/store";
import { Copy } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import {
	MessageAction,
	MessageActions as MessageActionsContainer,
} from "@/components/ai-elements/message";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AIUIMessage } from "@/types/ai";

// function MessageTimestamp({
// 	createdAt,
// 	showWithoutHover,
// }: {
// 	createdAt: Date;
// 	showWithoutHover?: boolean;
// }) {
// 	const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
// 	const timeString = date.toLocaleTimeString("en-US", {
// 		hour: "numeric",
// 		minute: "2-digit",
// 		hour12: true,
// 	});
// 	const fullDateString = date.toLocaleString();

// 	return (
// 		<div
// 			className={
// 				showWithoutHover
// 					? ""
// 					: "opacity-0 transition-opacity duration-150 focus-within:opacity-100 hover:opacity-100 group-hover/message:opacity-100 group-hover:opacity-100"
// 			}
// 		>
// 			<TooltipProvider>
// 				<Tooltip>
// 					<TooltipTrigger asChild>
// 						<span className="text-xs text-muted-foreground cursor-default">{timeString}</span>
// 					</TooltipTrigger>
// 					<TooltipContent>
// 						<p>{fullDateString}</p>
// 					</TooltipContent>
// 				</Tooltip>
// 			</TooltipProvider>
// 		</div>
// 	);
// }

// function SelectedModelId({
// 	showWithoutHover,
// 	selectedModel,
// }: {
// 	selectedModel: string;
// 	showWithoutHover?: boolean;
// }) {
// 	return (
// 		<div
// 			className={`ml-2 flex items-center ${
// 				showWithoutHover
// 					? ""
// 					: "opacity-0 transition-opacity duration-150 focus-within:opacity-100 hover:opacity-100 group-hover/message:opacity-100 group-hover:opacity-100"
// 			}`}
// 		>
// 			<Badge variant="outline" className="text-xs text-muted-foreground">
// 				{selectedModel}
// 			</Badge>
// 		</div>
// 	);
// }

export function PureMessageActions({
	messageId,
	isLoading,
}: {
	messageId: string;
	isLoading?: boolean;
}) {
	const message = useMessageById<AIUIMessage>(messageId);
	const isMobile = useIsMobile();

	const copyToClipboard = async () => {
		if (!message) {
			return;
		}

		const textFromParts = message.parts
			?.filter((part) => part.type === "text")
			.map((part) => part.text)
			.join("\n")
			.trim();

		if (!textFromParts) {
			toast.error("There's no text to copy!");
			return;
		}

		await navigator.clipboard.writeText(textFromParts);
		toast.success("Copied to clipboard!");
	};

	if (isLoading) {
		return <div className="h-7" />;
	}

	const showActionsWithoutHover = isMobile || message.role === "assistant";

	return (
		<div className="flex items-center gap-2">
			<MessageActionsContainer
				className={
					showActionsWithoutHover
						? ""
						: "opacity-0 transition-opacity duration-150 focus-within:opacity-100 hover:opacity-100 group-hover/message:opacity-100 group-hover:opacity-100"
				}
			>
				<MessageAction
					onClick={copyToClipboard}
					tooltip="Copy"
					className="h-7 w-7 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
				>
					<Copy className="size-4" />
				</MessageAction>
			</MessageActionsContainer>
			{/* {message && (
				<MessageTimestamp
					createdAt={
						typeof message.metadata?.createdAt === "string"
							? new Date(message.metadata.createdAt)
							: message.metadata?.createdAt || new Date()
					}
					showWithoutHover={showActionsWithoutHover}
				/>
			)} */}
			{/* {role === "assistant" && (
				<SelectedModelId
					selectedModel={message?.metadata?.selectedModel || ""}
					showWithoutHover={showActionsWithoutHover}
				/>
			)} */}
		</div>
	);
}

export const ChatMessageActions = memo(PureMessageActions);
