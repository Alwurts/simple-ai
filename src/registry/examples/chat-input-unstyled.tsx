"use client";

import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import { useState } from "react";
import { toast } from "sonner";

export default function ChatInputDemo() {
	const [value, setValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = () => {
		setIsLoading(true);
		setTimeout(() => {
			toast(value);
			setIsLoading(false);
		}, 1000);
	};

	return (
		<div className="w-full h-full">
			<ChatInput
				variant="unstyled"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSubmit={handleSubmit}
				loading={isLoading}
				onStop={() => setIsLoading(false)}
			>
				<ChatInputTextArea placeholder="Type a message..." />
				<ChatInputSubmit />
			</ChatInput>
		</div>
	);
}
