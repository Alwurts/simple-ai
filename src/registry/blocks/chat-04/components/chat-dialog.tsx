import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGenerationStore } from "@/registry/blocks/chat-04/hooks/generation-store";
import {
	ChatInput,
	ChatInputSubmit,
	ChatInputTextArea,
} from "@/registry/ui/chat-input";
import { useCompletion } from "ai/react";
import { useEffect } from "react";

interface ChatDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
	const versions = useGenerationStore((state) => state.versions);
	const currentVersion = useGenerationStore((state) => state.currentVersion);
	const setView = useGenerationStore((state) => state.setView);
	const updateCurrentCode = useGenerationStore(
		(state) => state.updateCurrentCode,
	);
	const updateStatus = useGenerationStore((state) => state.updateStatus);
	const addVersion = useGenerationStore((state) => state.addVersion);

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
			onOpenChange(false);
		},
		body: {
			currentCode: versions[currentVersion]?.code ?? "",
		},
	});

	const handleGenerate = () => {
		addVersion("", input);
		handleSubmit();
		setInput("");
		onOpenChange(false);
	};

	useEffect(() => {
		if (completion) {
			updateCurrentCode(completion);
		}
	}, [completion, updateCurrentCode]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
