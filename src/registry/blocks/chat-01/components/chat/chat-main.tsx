import { ChatContent } from "@/registry/blocks/chat-01/components/chat/chat-content";
import { ChatHeader } from "@/registry/blocks/chat-01/components/chat/chat-header";

export function ChatMain() {
	return (
		<div className="flex-1 flex flex-col h-full">
			<ChatHeader />
			<ChatContent />
		</div>
	);
}
