import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-label="Stop"
				>
					<title>Stop</title>
					<rect x="6" y="6" width="12" height="12" />
				</svg>
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
