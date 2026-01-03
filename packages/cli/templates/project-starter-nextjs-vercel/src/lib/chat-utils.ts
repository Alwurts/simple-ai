import type { AIUIMessage } from "@/types/ai";
import type { DBMessage } from "@/types/chat";

export function dbMessageToAIMessage(message: DBMessage): AIUIMessage {
	return {
		id: message.id,
		role: message.role,
		parts: message.parts,
		metadata: message.metadata,
	};
}

export function dbMessagesToAIMessages(messages: DBMessage[]): AIUIMessage[] {
	return messages.map(dbMessageToAIMessage);
}
