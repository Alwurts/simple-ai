"use client";

import { useEffect, useState } from "react";
import { Chat } from "./components/chat";
import { EditorLayout } from "./components/editor-layout";

function fixIncompleteJSX(jsx: string): string {
	const stack: string[] = [];
	const closingTags: string[] = [];
	let inExpression = false;
	let inTag = false;
	let currentTag = "";

	for (let i = 0; i < jsx.length; i++) {
		if (jsx[i] === "{" && !inTag) {
			inExpression = true;
		} else if (jsx[i] === "}" && !inTag) {
			inExpression = false;
		} else if (jsx[i] === "<") {
			inTag = true;
			currentTag = "<";
		} else if (jsx[i] === ">") {
			inTag = false;
			if (!inExpression && currentTag.startsWith("<")) {
				if (currentTag.startsWith("</")) {
					const tagName = currentTag.slice(2, -1);
					if (stack.length > 0 && stack[stack.length - 1] === tagName) {
						stack.pop();
					}
				} else if (!currentTag.endsWith("/>")) {
					const tagName = currentTag.slice(
						1,
						currentTag.indexOf(" ") !== -1
							? currentTag.indexOf(" ")
							: currentTag.length,
					);
					stack.push(tagName);
				}
			}
			currentTag = "";
		} else {
			if (inTag) {
				currentTag += jsx[i];
			}
		}
	}

	// Add missing closing tags
	while (stack.length > 0) {
		const tagName = stack.pop();
		if (tagName) {
			closingTags.unshift(`</${tagName}>`); // Unshift to maintain correct order
		}
	}

	return jsx + closingTags.join("");
}

export default function Page() {
	const [code, setCode] = useState(
		`<div className='bg-red-600 h-screen w-screen flex flex-col items-center justify-center gap-4'>
	<h1 className="text-white">Hello from the preview</h1>
	<p className="text-white">This is a paragraph</p>
`,
	);

	useEffect(() => {
		console.log("original");
		console.log(code);
		console.log("converted");
		console.log(fixIncompleteJSX(code));
	}, [code]);

	return (
		<div className="flex w-screen h-screen justify-start">
			<Chat />

			<EditorLayout code={code} setCode={setCode} />
		</div>
	);
}
