import { ChatInput } from "@/registry/ui/chat-input";
import { useState } from "react";

export default function ChatInputDemo() {
	const [value, setValue] = useState("");

	const handleSubmit = () => {
		alert(value);
	};

	return (
		<div className="w-full h-full">
			<ChatInput
				value={value}
				onChange={(e) => setValue(e.target.value)}
				submitMessage={handleSubmit}
			/>
		</div>
	);
}
