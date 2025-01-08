import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

export default function ChatMessageDemoFull() {
	return (
		<div className="w-full border rounded-lg">
			<ChatMessage key="1" id="1" type="outgoing" variant="full">
				<ChatMessageContent content="Hey how are you?" />
				<ChatMessageAvatar />
			</ChatMessage>

			<ChatMessage key="2" id="2" type="incoming" variant="full">
				<ChatMessageAvatar />
				<ChatMessageContent content="I'm fine, thanks for asking!" />
			</ChatMessage>

			<ChatMessage key="3" id="3" type="outgoing" variant="full">
				<ChatMessageContent content="Great!" />
				<ChatMessageAvatar />
			</ChatMessage>
		</div>
	);
}
