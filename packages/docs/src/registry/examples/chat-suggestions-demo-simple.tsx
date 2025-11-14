"use client";

import {
	ChatSuggestion,
	ChatSuggestions,
	ChatSuggestionsContent,
	ChatSuggestionsHeader,
	ChatSuggestionsTitle,
} from "@/registry/ui/chat-suggestions";

export default function ChatSuggestionsDemoSimple() {
	const suggestions = [
		"What can you help me with?",
		"Show me examples",
		"Explain the basics",
	];

	return (
		<div className="p-4">
			<ChatSuggestions>
				<ChatSuggestionsHeader>
					<ChatSuggestionsTitle>Quick start:</ChatSuggestionsTitle>
				</ChatSuggestionsHeader>
				<ChatSuggestionsContent>
					{suggestions.map(suggestion => (
						<ChatSuggestion key={suggestion}>{suggestion}</ChatSuggestion>
					))}
				</ChatSuggestionsContent>
			</ChatSuggestions>
		</div>
	);
}
