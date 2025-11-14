"use client";

import { useState } from "react";
import {
	ChatSuggestion,
	ChatSuggestions,
	ChatSuggestionsContent,
	ChatSuggestionsDescription,
	ChatSuggestionsHeader,
	ChatSuggestionsTitle,
} from "@/registry/ui/chat-suggestions";

export default function ChatSuggestionsDemo() {
	const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");

	const suggestions = [
		"Tell me about your features",
		"How do I get started?",
		"Show me an example",
		"What are the pricing options?",
	];

	return (
		<div className="flex flex-col gap-4 p-4">
			<ChatSuggestions>
				<ChatSuggestionsHeader>
					<ChatSuggestionsTitle>Try these prompts:</ChatSuggestionsTitle>
					<ChatSuggestionsDescription>
						Click a suggestion to get started
					</ChatSuggestionsDescription>
				</ChatSuggestionsHeader>
				<ChatSuggestionsContent>
					{suggestions.map(suggestion => (
						<ChatSuggestion
							key={suggestion}
							onClick={() => setSelectedSuggestion(suggestion)}
						>
							{suggestion}
						</ChatSuggestion>
					))}
				</ChatSuggestionsContent>
			</ChatSuggestions>

			{selectedSuggestion && (
				<div className="p-3 bg-muted rounded-md text-sm">
					<span className="font-medium">Selected:</span> {selectedSuggestion}
				</div>
			)}
		</div>
	);
}
