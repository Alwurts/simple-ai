"use client";

import * as React from "react";

export function useCopyToClipboard() {
	const [isCopied, setIsCopied] = React.useState(false);

	const copyToClipboard = React.useCallback(async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	}, []);

	return { copyToClipboard, isCopied };
}
