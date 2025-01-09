import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { MarkdownContent } from "../ui/markdown-content";

export default function MarkdownStreamingDemo() {
	const [content, setContent] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	const fullContent = `# The Lost Key
## A Tale of Mystery

* Sarah woke up to find her favorite golden key missing from its usual spot
* She remembered using it last night to lock her diary
* The search began:
  * Under the bed - nothing but dust
  * In her coat pockets - empty
  * On her desk - just scattered papers

> "Sometimes what we're looking for is right where we least expect it"

* As she made her bed, something shiny caught her eye
* The key had slipped between the pages of her book
* With a smile, she realized she'd been using it as a bookmark

*The End*`;

	useEffect(() => {
		// Typically you'd use a streaming API to get the content, this is just a demo
		if (!isStreaming) {
			return;
		}

		let currentIndex = 0;
		const words = fullContent.split(" ");

		const streamInterval = setInterval(() => {
			if (currentIndex >= words.length) {
				clearInterval(streamInterval);
				setIsStreaming(false);
				return;
			}

			const nextChunk = words.slice(0, currentIndex + 3).join(" ");
			setContent(nextChunk);
			currentIndex += 3;
		}, 70);

		return () => clearInterval(streamInterval);
	}, [isStreaming]);

	const handleStart = () => {
		setContent("");
		setIsStreaming(true);
	};

	return (
		<div className="space-y-4 w-full h-full">
			<div className="flex gap-2">
				<Button onClick={handleStart} disabled={isStreaming}>
					{content ? "Restart" : "Start"} Streaming
				</Button>
			</div>
			<div className="p-4 w-full min-h-[200px] border rounded-md overflow-y-auto">
				<MarkdownContent id="markdown-content-demo" content={content} />
			</div>
		</div>
	);
}
