"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	ChatMessage,
	ChatMessageAvatar,
	ChatMessageContent,
} from "@/registry/ui/chat-message";
import {
	MessageArea,
	MessageAreaContent,
	MessageAreaScrollButton,
} from "@/registry/ui/message-area";

const STORY = `# The Tale of the Enchanted Forest

Deep in a mystical realm, there lay an ancient forest that held secrets beyond imagination. The trees here weren't mere plants; they were the keepers of ancient wisdom, their leaves whispering tales of ages past.

## The Guardian's Call

In this magical place lived a young spirit named Aria, chosen by the forest itself to be its guardian. Her hair flowed like silver moonlight, and her eyes held the depth of ancient pools.

### The First Challenge

* One morning, Aria discovered that something was amiss
* The usually vibrant crystal flowers had begun to fade
* The ancient whispers of the trees grew fainter
* A shadow crept through the undergrowth

## The Journey Begins

Aria knew she had to act quickly. She gathered:
1. Dewdrops from spider webs at dawn
2. Starlight captured in moonflower petals
3. Songs of the morning birds
4. Tears of the evening mist

> "In the heart of every forest lies a truth waiting to be discovered" - Ancient Forest Proverb

### The Discovery

As Aria ventured deeper into the forest's heart, she found an ancient clearing. Here, the very air seemed to pulse with magic. Crystal formations emerged from the earth like frozen rainbows, each one containing memories of the forest's past.

## The Ancient Guardians

In her quest, Aria encountered the spirits of previous guardians:

* The Flame Keeper, whose torch lit the darkest paths
* The Wind Whisperer, who knew the language of storms
* The Earth Mother, who could heal the land with a touch
* The Star Walker, who mapped the celestial dance

Each spirit shared their wisdom:

1. "Change is the only constant in nature"
2. "Listen to the silence between heartbeats"
3. "Growth comes from embracing the unknown"
4. "Every ending is a new beginning"

### The Hidden Valley

Beyond the ancient clearing, Aria discovered a hidden valley where:

* Rainbow falls cascaded into pools of liquid starlight
* Flowers sang melodies of forgotten lullabies
* Butterflies painted the air with trails of golden dust
* Ancient runes danced on stone walls, telling stories of old

## The Dark Challenge

As night fell, shadows gathered and formed into creatures of doubt:

1. The Mist Wraith, who clouded clear thoughts
2. The Echo Thief, who stole confident voices
3. The Dream Weaver, who tangled hopes in fear
4. The Time Shifter, who made moments feel eternal

> "Courage is not the absence of fear, but the wisdom to dance with it" - Whispers of the Wise Trees

### The Battle Within

Aria faced her greatest challenge not in the physical realm, but within herself. She learned that:

* True power comes from acceptance
* Change can be beautiful and terrifying
* Magic flows through all living things
* Every creature has its own song to sing

## The Resolution

Through her connection with the forest, Aria learned that the fading magic was not a sign of decay, but of transformation. The forest wasn't dying; it was evolving, preparing for a new age of wonders.

### The New Beginning

* The crystal flowers bloomed again, brighter than ever
* New forms of magic emerged from the ancient earth
* The whispers of the trees grew stronger, carrying new songs
* And Aria, forever changed, became one with the forest's heart

## The Legacy

As the forest renewed itself:

1. Ancient spells transformed into new forms of magic
2. Lost pathways revealed themselves to worthy wanderers
3. The boundary between dreams and reality grew thin
4. Nature's wisdom found new ways to express itself

### The Eternal Dance

The forest continues its eternal dance:

* Seasons shift in kaleidoscope patterns
* Magic pulses in harmony with the earth's heartbeat
* New guardians arise when they're needed most
* Stories weave themselves into the fabric of reality

---

*And so, the tale of the Enchanted Forest continues, ever-changing, ever-growing, in the endless cycle of magic and wonder. Each day brings new mysteries, and each night holds its own enchantments, as the forest and its guardian dance their eternal dance of transformation and renewal...*`;

export default function ChatMessageAreaDemo() {
	const [streamContent, setStreamContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);

	useEffect(() => {
		if (!isStreaming) {
			return;
		}

		let currentIndex = 0;
		const words = STORY.split(" ");

		const streamInterval = setInterval(() => {
			if (currentIndex >= words.length) {
				clearInterval(streamInterval);
				setIsStreaming(false);
				return;
			}

			const nextChunk = words.slice(0, currentIndex + 3).join(" ");
			setStreamContent(nextChunk);
			currentIndex += 3;
		}, 70);

		return () => clearInterval(streamInterval);
	}, [isStreaming]);

	const handleStart = () => {
		setStreamContent("");
		setIsStreaming(true);
	};

	return (
		<div className="space-y-4 w-full h-full">
			<Button
				onClick={handleStart}
				disabled={isStreaming}
				className="w-full"
			>
				{streamContent ? "Restart Story" : "Start Story"}{" "}
				{isStreaming && "(Streaming...)"}
			</Button>
			<div className="border rounded-md h-[320px] overflow-y-auto">
				<MessageArea>
					<MessageAreaContent>
						<ChatMessage
							key="1"
							id="1"
							variant="bubble"
							type="outgoing"
						>
							<ChatMessageContent content="Can you tell me a magical story?" />
						</ChatMessage>

						{streamContent && (
							<ChatMessage key="2" id="2">
								<ChatMessageAvatar />
								<ChatMessageContent content={streamContent} />
							</ChatMessage>
						)}
					</MessageAreaContent>
					<MessageAreaScrollButton />
				</MessageArea>
			</div>
		</div>
	);
}
