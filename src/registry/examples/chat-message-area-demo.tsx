import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import { ChatMessageArea } from "@/registry/ui/chat-message-area";

export default function ChatMessageAreaDemo() {
	return (
		<ChatMessageArea className="space-y-4 p-4 max-h-[400px]">
			<ChatMessage key="1" id="1" variant="bubble" type="outgoing">
				<ChatMessageContent content="Can you tell me a story? Maybe something about a magical forest?" />
			</ChatMessage>

			<ChatMessage key="2" id="2">
				<ChatMessageAvatar />
				<ChatMessageContent content="Of course! I'd love to tell you a story about the Whispering Woods. Would you like to hear it?" />
			</ChatMessage>

			<ChatMessage key="3" id="3" variant="bubble" type="outgoing">
				<ChatMessageContent content="Yes, please! I'm excited to hear it!" />
			</ChatMessage>

			<ChatMessage key="4" id="4">
				<ChatMessageAvatar />
				<ChatMessageContent content="Deep in the heart of the Whispering Woods, there lived a young fox named Luna with fur as silver as moonlight. Unlike other foxes, Luna had the magical ability to speak with the ancient trees that surrounded her home." />
			</ChatMessage>

			<ChatMessage key="5" id="5">
				<ChatMessageAvatar />
				<ChatMessageContent content="One day, Luna discovered that the oldest tree in the forest had fallen silent. This was very unusual, as this particular oak tree loved telling stories about the forest's history. Concerned, Luna decided to investigate." />
			</ChatMessage>

			<ChatMessage key="6" id="6" variant="bubble" type="outgoing">
				<ChatMessageContent content="Oh no! What happened to the old oak tree?" />
			</ChatMessage>

			<ChatMessage key="7" id="7">
				<ChatMessageAvatar />
				<ChatMessageContent content="As Luna approached the ancient oak, she noticed something glowing at its roots - a tiny crystal that pulsed with a soft blue light. The tree had been protecting this crystal for centuries, and now it was losing its power." />
			</ChatMessage>

			<ChatMessage key="8" id="8">
				<ChatMessageAvatar />
				<ChatMessageContent content="Luna knew she had to help. She gathered dewdrops from spider webs at dawn, collected starlight in flower petals at night, and asked the wind to share its oldest songs. With these magical ingredients, she restored the crystal's power." />
			</ChatMessage>

			<ChatMessage key="9" id="9" variant="bubble" type="outgoing">
				<ChatMessageContent content="Did it work? Did the old oak tree start speaking again?" />
			</ChatMessage>

			<ChatMessage key="10" id="10">
				<ChatMessageAvatar />
				<ChatMessageContent content="Yes! The moment the crystal began glowing brightly again, the old oak's leaves rustled with joy, and its deep, wise voice returned. It thanked Luna for her help and shared even more wonderful stories about the forest's ancient magic." />
			</ChatMessage>

			<ChatMessage key="11" id="11">
				<ChatMessageAvatar />
				<ChatMessageContent content="From that day forward, Luna became known as the Guardian of the Whispering Woods, and she made sure to visit the old oak tree every day to hear its wonderful tales." />
			</ChatMessage>

			<ChatMessage key="12" id="12" variant="bubble" type="outgoing">
				<ChatMessageContent content="That was such a beautiful story! I loved how Luna helped save the old oak tree's voice." />
			</ChatMessage>

			<ChatMessage key="13" id="13">
				<ChatMessageAvatar />
				<ChatMessageContent content="I'm glad you enjoyed it! The story teaches us that even the smallest acts of kindness can help preserve the magic in our world." />
			</ChatMessage>
		</ChatMessageArea>
	);
}
