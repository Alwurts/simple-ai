import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

export default function ChatMessageDemoDefault() {
	return (
		<div className="w-full space-y-4">
			<ChatMessage key="1" id="1" type="outgoing">
				<ChatMessageContent content="Hey how are you?" />
				<ChatMessageAvatar />
			</ChatMessage>

			<ChatMessage key="2" id="2" type="incoming">
				<ChatMessageAvatar />
				<ChatMessageContent content="I'm fine, thanks for asking!" />
			</ChatMessage>

			<ChatMessage key="3" id="3" type="outgoing">
				<ChatMessageContent content="Great!" />
				<ChatMessageAvatar />
			</ChatMessage>
		</div>
	);
}
