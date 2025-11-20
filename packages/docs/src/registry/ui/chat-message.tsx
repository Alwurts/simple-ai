"use client";

import {
	Check,
	ChevronRight,
	Copy,
	SparklesIcon,
	UserIcon,
} from "lucide-react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MarkdownContent } from "@/registry/ui/markdown-content";

function ChatMessage({ className, ...props }: ComponentProps<"div">) {
	return (
		<TooltipProvider>
			<div
				className={cn(
					"group/chat-message relative flex w-full gap-2.5 py-2 px-3 rounded-md hover:bg-muted/50",
					className,
				)}
				{...props}
			/>
		</TooltipProvider>
	);
}

function ChatMessageContainer({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex w-full flex-col items-start gap-1", className)}
			{...props}
		/>
	);
}

function ChatMessageHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex items-center gap-2 px-2 text-sm", className)}
			{...props}
		/>
	);
}

function ChatMessageAuthor({ className, ...props }: ComponentProps<"span">) {
	return (
		<span
			className={cn("font-medium text-foreground", className)}
			{...props}
		/>
	);
}

interface ChatMessageTimestampProps extends ComponentProps<"span"> {
	createdAt: number | Date | string;
	format?: Intl.DateTimeFormatOptions;
}

function ChatMessageTimestamp({
	className,
	createdAt,
	format = { hour: "numeric", minute: "numeric" },
	...props
}: ChatMessageTimestampProps) {
	const date = createdAt instanceof Date ? createdAt : new Date(createdAt);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<span
					className={cn(
						"text-xs text-muted-foreground cursor-default",
						className,
					)}
					{...props}
				>
					{date.toLocaleTimeString("en-US", format)}
				</span>
			</TooltipTrigger>
			<TooltipContent>
				<p>{date.toLocaleString()}</p>
			</TooltipContent>
		</Tooltip>
	);
}

function ChatMessageContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("w-full flex flex-col gap-2 p-2", className)}
			{...props}
		/>
	);
}

interface ChatMessageMarkdownProps {
	content: string;
	className?: string;
}

function ChatMessageMarkdown({ content, className }: ChatMessageMarkdownProps) {
	return <MarkdownContent content={content || ""} className={className} />;
}

function ChatMessageFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"mt-1 flex items-center gap-2 px-2 text-xs text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function ChatMessageActions({
	className,
	children,
	...props
}: ComponentProps<typeof Card>) {
	return (
		<Card
			className={cn(
				"absolute -top-5 right-5 z-20 flex flex-row gap-1 p-1 opacity-0 transition-opacity group-hover/chat-message:opacity-100",
				className,
			)}
			{...props}
		>
			<TooltipProvider>{children}</TooltipProvider>
		</Card>
	);
}

interface ChatMessageActionProps extends ComponentProps<typeof Button> {
	className?: string;
	children?: ReactNode;
	label: string;
}

function ChatMessageAction({
	className,
	children,
	label,
	...props
}: ChatMessageActionProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn("h-7 w-7", className)}
					{...props}
				>
					{children}
					<span className="sr-only">{label}</span>
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{label}</p>
			</TooltipContent>
		</Tooltip>
	);
}

function ChatMessageActionCopy({
	className,
	onClick,
	...props
}: ComponentProps<typeof Button>) {
	const [hasCopied, setHasCopied] = useState(false);
	return (
		<ChatMessageAction
			label="Copy"
			onClick={(e) => {
				onClick?.(e);
				setHasCopied(true);
				setTimeout(() => setHasCopied(false), 2000);
			}}
			{...props}
		>
			{hasCopied ? (
				<Check className="size-4" />
			) : (
				<Copy className="size-4" />
			)}
		</ChatMessageAction>
	);
}

function ChatMessageAvatar(props: ComponentProps<typeof Avatar>) {
	return (
		<Avatar
			className="[&_svg]:size-4 [&:has(svg)]:border [&:has(svg)]:border-border [&:has(svg)]:items-center [&:has(svg)]:justify-center"
			{...props}
		/>
	);
}

function ChatMessageAvatarFallback(
	props: ComponentProps<typeof AvatarFallback>,
) {
	return <AvatarFallback {...props} />;
}

function ChatMessageAvatarImage(props: ComponentProps<typeof AvatarImage>) {
	return <AvatarImage {...props} />;
}

function ChatMessageAvatarUserIcon(props: ComponentProps<typeof UserIcon>) {
	return <UserIcon {...props} />;
}

function ChatMessageAvatarAssistantIcon(
	props: ComponentProps<typeof SparklesIcon>,
) {
	return <SparklesIcon {...props} />;
}

function ChatMessageThread({
	className,
	...props
}: ComponentProps<typeof Button>) {
	return (
		<Button
			variant="ghost"
			className={cn(
				"group/button flex h-auto w-full border border-none items-center justify-start gap-2 px-2 py-1.5 transition-all",
				"hover:border-input hover:bg-background hover:shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

function ChatMessageThreadReplyCount(props: ComponentProps<"span">) {
	return <span className="text-sm font-medium" {...props} />;
}

interface ChatMessageThreadTimestampProps extends ComponentProps<"span"> {
	date: Date | number | string;
}
function ChatMessageThreadTimestamp({
	date: dateProp,
	...props
}: ChatMessageThreadTimestampProps) {
	const date = new Date(dateProp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	return (
		<span
			className="block text-sm text-muted-foreground group-hover/button:hidden"
			{...props}
		>
			Last reply at {date}
		</span>
	);
}

function ChatMessageThreadAction(props: ComponentProps<"span">) {
	return (
		<span
			className="hidden w-full items-center gap-1 text-sm text-muted-foreground group-hover/button:flex"
			{...props}
		>
			View thread
			<ChevronRight className="ml-auto h-4 w-4" />
		</span>
	);
}

export {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageAvatarImage,
	ChatMessageAvatarFallback,
	ChatMessageAvatarUserIcon,
	ChatMessageAvatarAssistantIcon,
	ChatMessageContainer,
	ChatMessageHeader,
	ChatMessageAuthor,
	ChatMessageTimestamp,
	ChatMessageContent,
	ChatMessageMarkdown,
	ChatMessageFooter,
	ChatMessageActions,
	ChatMessageAction,
	ChatMessageActionCopy,
	ChatMessageThread,
	ChatMessageThreadReplyCount,
	ChatMessageThreadTimestamp,
	ChatMessageThreadAction,
};
