import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/utils";
import { SparklesIcon, UserIcon } from "lucide-react";
import React, { ReactNode } from "react";

type MessageVariant = "default" | "bubble" | "full";
type MessageAlignment = "left" | "right";
type MessageType = "incoming" | "outgoing";
type MessageSize = "sm" | "lg" | "default";

interface MessageContextValue {
	align?: MessageAlignment;
	variant?: MessageVariant;
	size?: MessageSize;
	type?: MessageType;
}

const ChatMessageContext = React.createContext<MessageContextValue | null>(
	null,
);

const useChatMessage = () => {
	const context = React.useContext(ChatMessageContext);
	return context;
};

// Root component
interface ChatMessageProps
	extends React.HTMLAttributes<HTMLDivElement>,
		MessageContextValue {
	children?: React.ReactNode;
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
	(
		{
			className,
			align = "left",
			variant = "default",
			size = "default",
			type = "incoming",
			children,
			...props
		},
		ref,
	) => {
		return (
			<ChatMessageContext.Provider value={{ align, variant, size, type }}>
				<div
					ref={ref}
					className={cn(
						"flex gap-4 w-full",
						variant === "full" && "p-5",
						variant === "full" && type === "outgoing" && "bg-muted",
						variant === "full" && type === "incoming" && "bg-background",
						align === "right" && "justify-end ml-auto",
						align === "left" && "justify-start mr-auto",
						size === "sm" && "text-sm",
						size === "default" && "text-base",
						size === "lg" && "text-lg",
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</ChatMessageContext.Provider>
		);
	},
);
ChatMessage.displayName = "ChatMessage";

// Avatar component
interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	imageSrc?: string;
	icon?: ReactNode;
}

const ChatMessageAvatar = React.forwardRef<
	HTMLDivElement,
	ChatMessageAvatarProps
>(({ className, icon: iconProps, imageSrc, ...props }, ref) => {
	const context = useChatMessage();
	const type = context?.type ?? "incoming";
	const icon =
		iconProps ?? (type === "incoming" ? <SparklesIcon /> : <UserIcon />);
	return (
		<div
			ref={ref}
			className={cn(
				"size-8 flex items-center rounded-full justify-center ring-1 shrink-0 bg-transparent overflow-hidden",
				type === "incoming" && "ring-border",
				type === "outgoing" && "ring-muted-foreground/30",
				className,
			)}
			{...props}
		>
			{imageSrc ? (
				<img src={imageSrc} alt="Avatar" className="size-full object-cover" />
			) : (
				<div className="translate-y-px [&_svg]:size-4 [&_svg]:shrink-0">
					{icon}
				</div>
			)}
		</div>
	);
});
ChatMessageAvatar.displayName = "ChatMessageAvatar";

// Content component that can work both with and without context
interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
	id: string;
	content: string;
}

const ChatMessageContent = React.forwardRef<
	HTMLDivElement,
	ChatMessageContentProps
>(({ className, content, id, ...props }, ref) => {
	const context = useChatMessage();

	// Use props if provided, otherwise fall back to context values
	const variant = context?.variant ?? "default";
	const size = context?.size ?? "default";
	const type = context?.type ?? "incoming";
	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col",
				variant === "bubble" && "rounded-xl px-3 py-2",
				variant === "bubble" &&
					type === "incoming" &&
					"bg-secondary text-secondary-foreground",
				variant === "bubble" &&
					type === "outgoing" &&
					"bg-primary text-primary-foreground",
				size === "sm" && "text-sm",
				size === "default" && "text-base",
				size === "lg" && "text-lg",
				className,
			)}
			{...props}
		>
			<Markdown id={id} content={content} />
		</div>
	);
});
ChatMessageContent.displayName = "ChatMessageContent";

export { ChatMessage, ChatMessageAvatar, ChatMessageContent };
