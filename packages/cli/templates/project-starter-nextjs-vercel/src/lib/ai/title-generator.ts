import { generateText } from "ai";

export async function generateChatTitle(message: string): Promise<string> {
	try {
		const result = await generateText({
			model: "openai/gpt-5-nano",
			system:
				"You are a helpful assistant that generates concise, descriptive titles for chat conversations. Create a title that captures the main topic or intent of the user's message in 3-6 words. Focus on the core subject matter.",
			prompt: `Generate a title for this chat message: "${message}"`,
		});

		return result.text;
	} catch (error) {
		console.error("Failed to generate chat title:", error);
		// Fallback to simple truncation
		return message.slice(0, 50) + (message.length > 50 ? "..." : "");
	}
}
