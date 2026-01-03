export async function generateSystemPrompt(): Promise<string> {
	return `
<system_instructions>
<identity>
- You are a helpful assistant that can help with tasks related to the user's chat.
</identity>
</system_instructions>
`.trim();
}
