import { Button } from "@/components/ui/button";
import { ArrowUpIcon, StopCircle } from "lucide-react";
import type { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps extends ButtonProps {
	submitMessage?: () => void;
	stop?: () => void;
	loading?: boolean;
}

export const SubmitButton = ({
	submitMessage,
	loading,
	stop,
	className,
	...props
}: SubmitButtonProps) => {
	if (loading && stop) {
		return (
			<Button
				type="button"
				onClick={stop}
				size="icon"
				className={cn("rounded-full border dark:border-zinc-600", className)}
				{...props}
			>
				<StopCircle />
			</Button>
		);
	}
	return (
		<Button
			className={cn("rounded-full border dark:border-zinc-600", className)}
			size="icon"
			onClick={(event) => {
				event.preventDefault();
				submitMessage?.();
			}}
			{...props}
		>
			<ArrowUpIcon />
		</Button>
	);
};

SubmitButton.displayName = "SubmitButton";
