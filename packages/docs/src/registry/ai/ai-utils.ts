import type { AIUIMessage } from "@/registry/ai/messages";
import { idToReadableText } from "@/registry/lib/id-to-readable-text";

export function uiMessageToText(message: AIUIMessage) {
	return message.parts
		.map((part) => {
			if (part.type === "text") {
				return part.text;
			}
			if (part.type === "reasoning") {
				return `Reasoning:\n${part.text}`;
			}
			if (part.type === "dynamic-tool" || part.type.startsWith("tool")) {
				return `Tool call: ${idToReadableText(part.type)}`;
			}
			return "";
		})
		.join("\n");
}
