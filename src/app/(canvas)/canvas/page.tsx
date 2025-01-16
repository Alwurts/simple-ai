"use client";

import { extractJsxContent } from "@/registry/blocks/chat-04/lib/complete-jsx-string";
import { JsxRenderer } from "@/registry/ui/jsx-renderer";
import Script from "next/script";
import { useEffect, useCallback, useState } from "react";

export default function Canvas() {
	const [code, setCode] = useState("");

	const handleMessageFromCanvasParent = useCallback((event: MessageEvent) => {
		const message = event.data;
		if (message.type === "CODE") {
			const jsx = extractJsxContent(message.code);
			if (jsx) {
				setCode(jsx);
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessageFromCanvasParent);
		return () =>
			window.removeEventListener("message", handleMessageFromCanvasParent);
	}, [handleMessageFromCanvasParent]);

	return (
		<>
			<Script src="https://cdn.tailwindcss.com" />
			<JsxRenderer jsx={code} />
		</>
	);
}
