import { useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";

export function useTextareaResize(value: ComponentProps<"textarea">["value"]) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useLayoutEffect(() => {
		const textArea = textareaRef.current;

		if (textArea) {
			// Reset height to auto first to get the correct scrollHeight
			textArea.style.height = "auto";
			const scrollHeight = textArea.scrollHeight;
			textArea.style.height = `${scrollHeight + 2}px`;
		}
	}, [textareaRef, value]);

	return textareaRef;
}
