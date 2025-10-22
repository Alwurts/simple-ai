import { MessagesSquare, Users } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
	AppHeader,
	AppHeaderIcon,
	AppHeaderSeparator,
} from "@/registry/blocks/chat-01/components/layout/app-header";

export function ChatHeader() {
	const connectionStatus = "connected";
	return (
		<AppHeader>
			<AppHeaderIcon className="hidden md:flex">
				<MessagesSquare />
			</AppHeaderIcon>
			<AppHeaderSeparator className="hidden md:block" />

			<ChatHeaderRoomName>Dev Team</ChatHeaderRoomName>
			<div className="ml-auto flex items-center">
				<ChatHeaderRoomMemberCount>{10}</ChatHeaderRoomMemberCount>
				<AppHeaderSeparator />
				<Tooltip>
					<TooltipTrigger>
						<ChatRoomConnectionStatus
							connectionStatus={connectionStatus}
						/>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p className="capitalize">{connectionStatus}</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</AppHeader>
	);
}

function ChatHeaderRoomName({
	className,
	...props
}: ComponentProps<typeof Button>) {
	return (
		<Button
			variant="ghost"
			size="sm"
			className={cn("text-base h-7", className)}
			{...props}
		/>
	);
}

function ChatHeaderRoomMemberCount({
	className,
	children,
	...props
}: ComponentProps<typeof Button> & { children: number }) {
	return (
		<Button variant="ghost" size="sm" className="gap-2 h-7" {...props}>
			<Users className="h-4 w-4" />
			{children}
		</Button>
	);
}

function ChatRoomConnectionStatus({
	className,
	connectionStatus,
	...props
}: ComponentProps<"div"> & {
	connectionStatus: "connected" | "connecting" | "disconnected";
}) {
	return (
		<div
			className={cn(
				"h-2 w-2 rounded-full transition-colors",
				{
					"bg-green-500": connectionStatus === "connected",
					"bg-yellow-500": connectionStatus === "connecting",
					"bg-orange-500": connectionStatus === "disconnected",
				},
				className,
			)}
			{...props}
		/>
	);
}
