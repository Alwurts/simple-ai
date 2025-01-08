import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

export default function ChatMessageDemoMarkdownContent() {
	return (
		<div className="w-full border rounded-lg">
			<ChatMessage key="1" id="1" type="outgoing" variant="full">
				<ChatMessageContent content="Can you give me a summary of today's tech news?" />
				<ChatMessageAvatar />
			</ChatMessage>

			<ChatMessage key="2" id="2" type="incoming" variant="full">
				<ChatMessageAvatar />
				<ChatMessageContent
					content={`Sure, here's a summary of today's tech news:
### Technology

Latest developments in Technology:
* OpenAI announces new breakthrough in language models
* Tech giants collaborate on AI safety standards
* Quantum computing reaches new milestone
`}
				/>
			</ChatMessage>

			<ChatMessage key="3" id="3" type="outgoing" variant="full">
				<ChatMessageContent content="Thanks for the update!" />
				<ChatMessageAvatar />
			</ChatMessage>
		</div>
	);
}
