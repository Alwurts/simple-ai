"use client";

import { useState } from "react";
import { Chat } from "./components/chat";
import { Preview } from "./components/preview";
import { CodeEditor } from "./components/code-editor";

export default function Page() {
	const [code, setCode] = useState("<div className='bg-red-600'>Hello from the preview</div>");
	const [isPreviewMode, setIsPreviewMode] = useState(true);

	return (
		<div className="flex w-screen h-screen justify-start">
			<Chat />
			<div className="flex-1 flex">
				{isPreviewMode ? (
					<Preview 
						code={code} 
						isPreviewMode={isPreviewMode}
						onChangeMode={setIsPreviewMode}
					/>
				) : (
					<CodeEditor 
						code={code} 
						onChange={setCode}
						isPreviewMode={isPreviewMode}
						onChangeMode={setIsPreviewMode}
					/>
				)}
			</div>
		</div>
	);
}
