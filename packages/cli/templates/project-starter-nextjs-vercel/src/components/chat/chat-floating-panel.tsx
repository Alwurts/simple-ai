"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
	ResizableSheet,
	ResizableSheetContent,
	ResizableSheetDescription,
	ResizableSheetHeader,
	ResizableSheetTitle,
} from "@/components/ui/resizable-sheet";
import { useChatClientLogic } from "@/hooks/use-chat-client-logic";
import { ChatInterface } from "./chat-interface";

interface SidePanelChatProps extends React.ComponentProps<typeof ResizableSheet> {
	id: string; // This ID prop might be used for the Sheet ID, not necessarily the Chat ID
}

export function SidePanelChat({ id, ...props }: SidePanelChatProps) {
	return (
		<ResizableSheet defaultWidth={400} minWidth={300} maxWidth={600} {...props}>
			<ResizableSheetContent side="right" className="p-0">
				<SidePanelChatContent />
			</ResizableSheetContent>
		</ResizableSheet>
	);
}

function SidePanelChatContent() {
	// We reuse the URL logic here so the floating panel syncs with the page URL.
	// If you wanted the floating panel to be independent of the URL, you would
	// simply use a local useState for the chatId instead of useSearchParams.
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const chatIdParam = searchParams.get("chatId");

	const {
		id: chatId,
		isLoading,
		messages,
		onNewChatCreated,
	} = useChatClientLogic({
		chatId: chatIdParam,
	});

	const handleNewChat = useCallback(
		(newChatId: string) => {
			onNewChatCreated(newChatId);

			const params = new URLSearchParams(searchParams.toString());
			params.set("chatId", newChatId);
			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams, onNewChatCreated],
	);

	return (
		<>
			<ResizableSheetHeader className="p-4 pb-0">
				<ResizableSheetTitle>Chat Assistant</ResizableSheetTitle>
				<ResizableSheetDescription>
					Ask questions and get help with your tasks.
				</ResizableSheetDescription>
			</ResizableSheetHeader>

			<div className="flex-1 min-h-0 flex flex-col pt-4">
				{isLoading ? (
					<div className="flex h-full items-center justify-center text-muted-foreground">
						Loading...
					</div>
				) : (
					<ChatInterface
						key={chatId}
						id={chatId}
						initialMessages={messages}
						onNewChat={handleNewChat}
					/>
				)}
			</div>
		</>
	);
}
