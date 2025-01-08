import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

export default function ChatMessageDemo() {
	return (
		<div className="w-full px-4 py-8 space-y-4 border rounded-lg">
			<ChatMessage key="1" id="1" variant="bubble" type="outgoing">
				<ChatMessageContent content="Hey how are you?" />
			</ChatMessage>

			<ChatMessage key="2" id="2">
				<ChatMessageAvatar />
				<ChatMessageContent content="I'm fine, thanks for asking!" />
			</ChatMessage>

			<ChatMessage key="3" id="3" variant="bubble" type="outgoing">
				<ChatMessageContent content="Great!" />
			</ChatMessage>
		</div>
	);
}
