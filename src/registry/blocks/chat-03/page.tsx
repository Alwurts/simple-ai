"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Chat } from "@/registry/blocks/chat-03/components/chat";

export default function Page() {
	const [open, setOpen] = useState(true);

	return (
		<div className="h-screen flex items-center justify-center">
			<Button size="lg" onClick={() => setOpen(true)}>
				Open Chat
			</Button>
			<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4">
				{open && (
					<div className="w-[400px] h-[600px] bg-background border rounded-lg shadow-lg flex flex-col overflow-hidden">
						<div className="flex items-center justify-between p-4 border-b">
							<h4 className="font-semibold">Chat</h4>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setOpen(false)}
							>
								<span className="sr-only">Close chat</span>
								<X />
							</Button>
						</div>
						<Chat />
					</div>
				)}
			</div>
		</div>
	);
}
