"use client";

import { Versions } from "./components/versions";
import { EditorLayout } from "./components/editor-layout";
import { useState } from "react";

export default function Page() {
	const [chatOpen, setChatOpen] = useState(true);

	return (
		<div className="flex w-screen h-screen justify-start">
			<Versions className="hidden md:flex" onChatOpen={() => setChatOpen(true)} />
			<EditorLayout chatOpen={chatOpen} onChatOpenChange={setChatOpen} />
		</div>
	);
}
