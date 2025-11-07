"use client";

import type { ComponentProps } from "react";
import { useLayoutEffect, useRef } from "react";

export function useTextareaResize(
	value: ComponentProps<"textarea">["value"],
	rows = 1,
) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useLayoutEffect(() => {
		const textArea = textareaRef.current;

		if (textArea) {
			// Get the line height to calculate minimum height based on rows
			const computedStyle = window.getComputedStyle(textArea);
			const lineHeight =
				Number.parseInt(computedStyle.lineHeight, 10) || 20;
			const padding =
				Number.parseInt(computedStyle.paddingTop, 10) +
				Number.parseInt(computedStyle.paddingBottom, 10);

			// Calculate minimum height based on rows
			const minHeight = lineHeight * rows + padding;

			// Reset height to auto first to get the correct scrollHeight
			textArea.style.height = "0px";
			const scrollHeight = Math.max(textArea.scrollHeight, minHeight);

			// Set the final height
			textArea.style.height = `${scrollHeight + 2}px`;
		}
		// textareaRef is a ref object and shouldn't be in dependencies
		// Only re-run when value or rows change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, rows]);

	return textareaRef;
}
