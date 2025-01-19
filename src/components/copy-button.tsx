"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { type Event, useTrackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface CopyButtonProps extends ButtonProps {
	value: string;
	src?: string;
	event?: Event["name"];
}

export async function copyToClipboardWithMeta(
	value: string,
	event?: Event,
	track?: (event: Event) => void,
) {
	navigator.clipboard.writeText(value);
	if (event && track) {
		track(event);
	}
}

export function CopyButton({
	value,
	className,
	src,
	event,
	variant = "ghost",
	...props
}: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);
	const track = useTrackEvent();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<Button
			size="icon"
			variant={variant}
			className={cn(
				"relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 [&_svg]:h-3 [&_svg]:w-3",
				className,
			)}
			onClick={() => {
				copyToClipboardWithMeta(
					value,
					event
						? {
								name: event,
								properties: {
									code: value,
								},
							}
						: undefined,
					track,
				);
				setHasCopied(true);
			}}
			{...props}
		>
			<span className="sr-only">Copy</span>
			{hasCopied ? <CheckIcon /> : <ClipboardIcon />}
		</Button>
	);
}
