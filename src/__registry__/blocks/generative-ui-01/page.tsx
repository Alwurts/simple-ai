"use client";

import { EditorLayout } from "@/registry/blocks/generative-ui-01/components/editor-layout";
import { Versions } from "@/registry/blocks/generative-ui-01/components/versions";
import { useState } from "react";

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
