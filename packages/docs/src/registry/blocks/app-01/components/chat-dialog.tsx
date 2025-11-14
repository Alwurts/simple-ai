import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGenerationStore } from "@/registry/blocks/app-01/hooks/generation-store";
import {
	ChatInput,
	ChatInputEditor,
	ChatInputGroupAddon,
	ChatInputSubmitButton,
	useChatInput,
} from "@/registry/ui/chat-input";

export function ChatDialog() {
	const versions = useGenerationStore(state => state.versions);
	const currentVersion = useGenerationStore(state => state.currentVersion);
	const setView = useGenerationStore(state => state.setView);
	const updateCurrentCode = useGenerationStore(
		state => state.updateCurrentCode,
	);
	const updateStatus = useGenerationStore(state => state.updateStatus);
	const addVersion = useGenerationStore(state => state.addVersion);
	const chatOpen = useGenerationStore(state => state.chatOpen);
	const setChatOpen = useGenerationStore(state => state.setChatOpen);

	const { completion, isLoading, complete, stop } = useCompletion({
		api: "/api/ai/generate",
		onFinish: (_prompt, completion) => {
			setView("preview");
			updateCurrentCode(completion);
			updateStatus("complete");
			setChatOpen(false);
		},
		body: {
			currentCode: versions[currentVersion]?.code ?? "",
		},
	});

	const {
		value,
		onChange,
		handleSubmit: chatInputSubmit,
	} = useChatInput({
		onSubmit: parsedValue => {
			addVersion("", parsedValue.content);
			complete(parsedValue.content);
			setChatOpen(false);
		},
	});

	useEffect(() => {
		if (completion) {
			updateCurrentCode(completion);
		}
	}, [completion, updateCurrentCode]);

	return (
		<Dialog open={chatOpen} onOpenChange={setChatOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>What UI do you want to build?</DialogTitle>
				</DialogHeader>

				<ChatInput
					value={value}
					onChange={onChange}
					onSubmit={chatInputSubmit}
					isStreaming={isLoading}
					onStop={stop}
				>
					<ChatInputEditor placeholder="Type your code generation prompt..." />
					<ChatInputGroupAddon align="block-end">
						<ChatInputSubmitButton className="ml-auto" />
					</ChatInputGroupAddon>
				</ChatInput>
			</DialogContent>
		</Dialog>
	);
}
