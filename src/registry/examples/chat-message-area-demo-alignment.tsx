"use client";

import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";

const messages = [
	{
		id: "1",
		content:
			"Can you tell me a story? Maybe something about a magical forest?",
		type: "user",
	},
	{
		id: "2",
		content:
			"Of course! I'd love to tell you a story about the Whispering Woods. Would you like to hear it?",
		type: "assistant",
	},
	{
		id: "3",
		content: "Yes, please! I'm excited to hear it!",
		type: "user",
	},
	{
		id: "4",
		content:
			"Deep in the heart of the Whispering Woods, there lived a young fox named Luna with fur as silver as moonlight. Unlike other foxes, Luna had the magical ability to speak with the ancient trees that surrounded her home.",
		type: "assistant",
	},
	{
		id: "5",
		content:
			"One day, Luna discovered that the oldest tree in the forest had fallen silent. This was very unusual, as this particular oak tree loved telling stories about the forest's history. Concerned, Luna decided to investigate.",
		type: "assistant",
	},
	{
		id: "6",
		content: "Oh no! What happened to the old oak tree?",
		type: "user",
	},
	{
		id: "7",
		content:
			"As Luna approached the ancient oak, she noticed something glowing at its roots - a tiny crystal that pulsed with a soft blue light. The tree had been protecting this crystal for centuries, and now it was losing its power.",
		type: "assistant",
	},
	{
		id: "8",
		content:
			"Luna knew she had to help. She gathered dewdrops from spider webs at dawn, collected starlight in flower petals at night, and asked the wind to share its oldest songs. With these magical ingredients, she restored the crystal's power.",
		type: "assistant",
	},
	{
		id: "9",
		content: "Did it work? Did the old oak tree start speaking again?",
		type: "user",
	},
	{
		id: "10",
		content:
			"Yes! The moment the crystal began glowing brightly again, the old oak's leaves rustled with joy, and its deep, wise voice returned. It thanked Luna for her help and shared even more wonderful stories about the forest's ancient magic.",
		type: "assistant",
	},
	{
		id: "11",
		content:
			"From that day forward, Luna became known as the Guardian of the Whispering Woods, and she made sure to visit the old oak tree every day to hear its wonderful tales.",
		type: "assistant",
	},
	{
		id: "12",
		content:
			"That was such a beautiful story! I loved how Luna helped save the old oak tree's voice.",
		type: "user",
	},
	{
		id: "13",
		content:
			"I'm glad you enjoyed it! The story teaches us that even the smallest acts of kindness can help preserve the magic in our world.",
		type: "assistant",
	},
];

export default function ChatMessageAreaDemoAlignment() {
	return (
		<ChatMessageArea
			className="space-y-4 p-4 max-h-[400px]"
			scrollButtonAlignment="center"
		>
			{messages.map((message) => (
				<ChatMessage
					key={message.id}
					id={message.id}
					variant="bubble"
					type={message.type === "user" ? "outgoing" : "incoming"}
				>
					{message.type === "assistant" && (
						<ChatMessageAvatar imageSrc="/avatar-1.png" />
					)}
					<ChatMessageContent content={message.content} />
					{message.type === "user" && (
						<ChatMessageAvatar imageSrc="/avatar-2.png" />
					)}
				</ChatMessage>
			))}
		</ChatMessageArea>
	);
}
