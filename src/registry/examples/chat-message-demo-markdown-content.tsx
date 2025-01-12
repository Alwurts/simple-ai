import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";

const messages = [
	{
		id: "1",
		content: "Can you give me a summary of today's tech news?",
		type: "user",
	},
	{
		id: "2",
		content: `Sure, here's a summary of today's tech news:
### Technology

Latest developments in Technology:
* OpenAI announces new breakthrough in language models
* Tech giants collaborate on AI safety standards
* Quantum computing reaches new milestone
`,
		type: "assistant",
	},
	{
		id: "3",
		content: "Thanks for the update!",
		type: "user",
	},
];

export default function ChatMessageDemoMarkdownContent() {
	return (
		<div className="w-full border rounded-lg">
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					id={message.id}
					type={message.type === "user" ? "outgoing" : "incoming"}
					variant="full"
				>
					{message.type === "assistant" && <ChatMessageAvatar />}
					<ChatMessageContent content={message.content} />
					{message.type === "user" && <ChatMessageAvatar />}
				</ChatMessage>
			))}
		</div>
	);
}
