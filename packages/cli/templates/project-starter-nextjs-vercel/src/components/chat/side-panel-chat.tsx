"use client";

import { ChatMain } from "@/components/chat/chat-main";
import { Button } from "@/components/ui/button";
import {
	ResizableSheet,
	ResizableSheetContent,
	ResizableSheetDescription,
	ResizableSheetHeader,
	ResizableSheetTitle,
	ResizableSheetTrigger,
} from "@/components/ui/resizable-sheet";

export function SidePanelChat() {
	return (
		<ResizableSheet defaultWidth={400} minWidth={300} maxWidth={600}>
			<ResizableSheetTrigger asChild>
				<Button variant="outline" className="w-full">
					Open Chat Panel
				</Button>
			</ResizableSheetTrigger>
			<ResizableSheetContent side="right" className="p-0">
				<SidePanelChatContent />
			</ResizableSheetContent>
		</ResizableSheet>
	);
}

export function SidePanelChatContent() {
	return (
		<>
			<ResizableSheetHeader>
				<ResizableSheetTitle>Chat Panel</ResizableSheetTitle>
				<ResizableSheetDescription>
					This is a resizable chat panel that can be dragged to adjust its width.
				</ResizableSheetDescription>
			</ResizableSheetHeader>

			<ChatMain id="side-panel-chat" />
		</>
	);
}
