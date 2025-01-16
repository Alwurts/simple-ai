import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGenerationStore } from "@/registry/blocks/generative-ui-01/hooks/generation-store";
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import { useCompletion } from "ai/react";
import { useEffect } from "react";

export function ChatDialog() {
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const setView = useGenerationStore((state) => state.setView);
	const updateCurrentCode = useGenerationStore(
		(state) => state.updateCurrentCode,
	);
	const updateStatus = useGenerationStore((state) => state.updateStatus);
	const addVersion = useGenerationStore((state) => state.addVersion);
	const chatOpen = useGenerationStore((state) => state.chatOpen);
	const setChatOpen = useGenerationStore((state) => state.setChatOpen);

	const {
		completion,
		isLoading,
		input,
		handleInputChange,
		handleSubmit,
		stop,
		setInput,
	} = useCompletion({
		api: "/api/ai/generate",
		onFinish: (_, completion) => {
			setView("preview");
			updateCurrentCode(completion);
			updateStatus("complete");
			setChatOpen(false);
		},
		body: {
			currentCode: versions[currentVersion]?.code ?? "",
		},
	});

	const handleGenerate = () => {
		addVersion("", input);
		handleSubmit();
		setInput("");
		setChatOpen(false);
	};

	useEffect(() => {
		if (completion) {
			updateCurrentCode(completion);
		}
	}, [completion, updateCurrentCode]);

	return (
		<Dialog open={chatOpen} onOpenChange={setChatOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Generate Code</DialogTitle>
				</DialogHeader>
				<div className="py-4">
					<ChatInput
						value={input}
						onChange={handleInputChange}
						onSubmit={handleGenerate}
						loading={isLoading}
						onStop={stop}
					>
						<ChatInputTextArea placeholder="Type your code generation prompt..." />
						<ChatInputSubmit />
					</ChatInput>
				</div>
			</DialogContent>
		</Dialog>
	);
}
