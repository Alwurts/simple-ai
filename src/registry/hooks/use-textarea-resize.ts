import { useLayoutEffect, useRef } from "react";
import type { ComponentProps } from "react";

export function useTextareaResize(value: ComponentProps<"textarea">["value"]) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useLayoutEffect(() => {
		const textArea = textareaRef.current;

		if (textArea) {
			textArea.style.height = "0px";
			const scrollHeight = textArea.scrollHeight;
			textArea.style.height = `${scrollHeight}px`;
		}
	}, [textareaRef, value]);

	return textareaRef;
}
