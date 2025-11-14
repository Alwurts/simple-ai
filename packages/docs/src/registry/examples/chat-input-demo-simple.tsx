"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "@/registry/ui/chat-input";

export default function ChatInputDemo() {
	const [isLoading, setIsLoading] = useState(false);

	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: parsed => {
			setIsLoading(true);
			toast(parsed.content);
			setTimeout(() => setIsLoading(false), 1000);
		},
	});

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-full max-w-md">
				<ChatInput
					onSubmit={handleSubmit}
					value={value}
					onChange={onChange}
					isStreaming={isLoading}
					onStop={() => setIsLoading(false)}
				>
					<ChatInputEditor placeholder="Type a message..." />
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" />
					</ChatInputGroupAddon>
				</ChatInput>
			</div>
		</div>
	);
}
