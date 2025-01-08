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
				onClick={stop}
				className={cn(
					"shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600",
					className,
				)}
				{...props}
			>
				<StopCircle />
			</Button>
		);
	}
	return (
		<Button
			className={cn(
				"shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600",
				className,
			)}
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
