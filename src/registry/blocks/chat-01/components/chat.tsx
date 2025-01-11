import { Card } from "@/components/ui/card";
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";
import { useState, type ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

export function Chat({ className, ...props }: ComponentPropsWithoutRef<"div">) {
	const [value, setValue] = useState("");

	const messages: {
		id: string;
		content: string;
		role: "user" | "assistant";
	}[] = [
		{
			id: "1",
			content: "Hey, how's your day going?",
			role: "user",
		},
		{
			id: "2",
			content: "It's going pretty well, thanks for asking! How about yours?",
			role: "assistant",
		},
		{
			id: "3",
			content: "Not bad, just chilling at home. What did you do today?",
			role: "user",
		},
		{
			id: "4",
			content:
				"I spent some time reading and then went for a walk. It was nice. I later went to the gym and then had dinner with some friends. In the evening, I watched a movie and then went to bed.",
			role: "assistant",
		},
		{
			id: "5",
			content: "What about you? What did you do today?",
			role: "assistant",
		},
	];

	return (
		<Card
			className="w-full max-w-xl mx-auto flex flex-col flex-1 h-[700px]"
			{...props}
		>
			<div className="flex-1 flex flex-col min-h-0">
				<ChatMessageArea className="px-4 py-8 space-y-4">
					{messages.map((message) => {
						if (message.role !== "user") {
							return (
								<ChatMessage key={message.id} id={message.id}>
									<ChatMessageAvatar />
									<ChatMessageContent content={message.content} />
								</ChatMessage>
							);
						}
						return (
							<ChatMessage
								key={message.id}
								id={message.id}
								variant="bubble"
								type="outgoing"
							>
								<ChatMessageContent content={message.content} />
							</ChatMessage>
						);
					})}
				</ChatMessageArea>
				<div className="border-t p-4">
					<ChatInput
						variant="default"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onSubmit={() => {
							toast(value);
						}}
					>
						<ChatInputTextArea placeholder="Type a message..." />
						<ChatInputSubmit />
					</ChatInput>
				</div>
			</div>
		</Card>
	);
}
