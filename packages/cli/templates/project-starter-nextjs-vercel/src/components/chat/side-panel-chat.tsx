"use client";

import {
	ResizableSheet,
	ResizableSheetContent,
	ResizableSheetDescription,
	ResizableSheetHeader,
	ResizableSheetTitle,
} from "@/components/ui/resizable-sheet";
import { ChatInputArea } from "./chat-input-area";
import { Chat } from "./chat-layout";
import { ChatMessages } from "./chat-messages";

interface SidePanelChatProps extends React.ComponentProps<typeof ResizableSheet> {
	id: string;
}

export function SidePanelChat({ id, ...props }: SidePanelChatProps) {
	return (
		<ResizableSheet defaultWidth={400} minWidth={300} maxWidth={600} {...props}>
			<ResizableSheetContent side="right" className="p-0">
				<SidePanelChatContent id={id} />
			</ResizableSheetContent>
		</ResizableSheet>
	);
}

export function SidePanelChatContent({ id }: { id: string }) {
	return (
		<>
			<ResizableSheetHeader>
				<ResizableSheetTitle>Chat Panel</ResizableSheetTitle>
				<ResizableSheetDescription>
					This is a resizable chat panel that can be dragged to adjust its width.
				</ResizableSheetDescription>
			</ResizableSheetHeader>

			<Chat id={id} initialMessages={[]}>
				<ChatMessages />
				<ChatInputArea />
			</Chat>
		</>
	);
}
