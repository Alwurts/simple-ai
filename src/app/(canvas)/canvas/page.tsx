"use client";

import Script from "next/script";
import { useEffect, useCallback, useState } from "react";
import JsxParser from "react-jsx-parser";

export default function Canvas() {
	const [code, setCode] = useState("");
	const handleMessageFromCanvasParent = useCallback((event: MessageEvent) => {
		// Handle messages from parent here
		const message = event.data;
		//console.log("Message received from parent:", message);
		if (message.type === "CODE") {
			setCode(message.code);
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
			<JsxParser jsx={code} />
		</>
	);
}
