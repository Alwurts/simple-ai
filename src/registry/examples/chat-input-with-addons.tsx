"use client";

import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputGroupButton,
	ChatInputGroupText,
	ChatInputSubmitButton,
	useChatInput,
} from "@/registry/ui/chat-input";

export default function ChatInputWithAddons() {
	const { value, onChange, handleSubmit } = useChatInput({
		onSubmit: (parsed) => {
			console.log("Submitted:", parsed.content);
		},
	});

	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="w-full max-w-md">
				<ChatInput
					onSubmit={handleSubmit}
					value={value}
					onChange={onChange}
				>
					<ChatInputEditor placeholder="Type a message..." />
					<ChatInputGroupAddon align="block-end">
						<ChatInputGroupButton
							variant="outline"
							className="rounded-full"
							size="icon-sm"
						>
							<PlusIcon />
						</ChatInputGroupButton>
						<ChatInputGroupText className="ml-auto">
							52% used
						</ChatInputGroupText>
						<Separator orientation="vertical" className="!h-6" />
						<ChatInputSubmitButton />
					</ChatInputGroupAddon>
				</ChatInput>
			</div>
		</div>
	);
}
