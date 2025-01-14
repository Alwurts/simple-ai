"use client";

import { useEffect } from "react";
import { Chat } from "./components/chat";
import { EditorLayout } from "./components/editor-layout";
import { useGenerationStore } from "./store";

const INITIAL_CODE = `<div className='bg-red-600 h-screen w-screen flex flex-col items-center justify-center gap-4'>
	<h1 className="text-white">Hello from the preview</h1>
	<p className="text-white">This is a paragraph</p>
</div>`;

export default function Page() {
	const { versions, addVersion } = useGenerationStore();

	useEffect(() => {
		// Only add initial version if there are no versions yet
		if (versions.length === 0) {
			addVersion(INITIAL_CODE);
		}
	}, [versions.length, addVersion]);

	return (
		<div className="flex w-screen h-screen justify-start">
			<Chat />
			<EditorLayout />
		</div>
	);
}
