import { Button } from "@/components/ui/button";
import { ArrowUpIcon, StopCircle } from "lucide-react";

interface SubmitButtonProps {
	submitMessage: () => void;
	stop: () => void;
	loading: boolean;
}

export const SubmitButton = ({
	submitMessage,
	loading,
	stop,
}: SubmitButtonProps) => {
	if (loading) {
		return (
			<Button
				type="button"
				onClick={stop}
				size="icon"
				className="rounded-full border dark:border-zinc-600"
			>
				<StopCircle />
			</Button>
		);
	}
	return (
		<Button
			className="rounded-full border dark:border-zinc-600"
			size="icon"
			onClick={(event) => {
				event.preventDefault();
				submitMessage();
			}}
		>
			<ArrowUpIcon />
		</Button>
	);
};

SubmitButton.displayName = "SubmitButton";
