import { ChatMessage, ChatMessageContent } from "@/registry/ui/chat-message";

export default function ChatMessageDemoWithoutAvatar() {
	return (
		<div className="w-full space-y-4">
			<ChatMessage key="1" id="1" type="outgoing" variant="bubble">
				<ChatMessageContent content="Hey how are you?" />
			</ChatMessage>

			<ChatMessage key="2" id="2" type="incoming" variant="bubble">
				<ChatMessageContent content="I'm fine, thanks for asking!" />
			</ChatMessage>

			<ChatMessage key="3" id="3" type="outgoing" variant="bubble">
				<ChatMessageContent content="Great!" />
			</ChatMessage>
		</div>
	);
}
