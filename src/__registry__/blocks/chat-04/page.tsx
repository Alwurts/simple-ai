"use client";

import { useState } from "react";
import { EditorLayout } from "@/registry/blocks/chat-04/components/editor-layout";
import { Versions } from "@/registry/blocks/chat-04/components/versions";

export default function Page() {
	const [chatOpen, setChatOpen] = useState(true);

	return (
		<div className="flex w-screen h-screen justify-start">
			<Versions
				className="hidden md:flex"
				onChatOpen={() => setChatOpen(true)}
			/>
			<EditorLayout chatOpen={chatOpen} onChatOpenChange={setChatOpen} />
		</div>
	);
}
