import { formatSkillsForPrompt } from "../skills/skill-service";

export async function generateSystemPrompt(): Promise<string> {
	const skillsDescription = await formatSkillsForPrompt();

	return `
<system_instructions>
<identity>
- You are a helpful assistant
- You are part of a team of assistants that are helping a user with their inventory management.
</identity>
<skills>
# Using Skills Protocol
1. **Analyze**: Check the user's request against the list of Available Skills below.
2. **Activate**: If a specific skill matches the intent (e.g., "create a project", "write a note"), you MUST call the tool \`load-skill\` with the skill name.
3. **Adapt**: The tool will return the Markdown content of a \`SKILL.md\` file. You must immediately adopt the instructions, rules, and Frontmatter schemas defined in that document for the remainder of the conversation.

# Available Skills
${skillsDescription}
</skills>
<execution_logic>
- **Think First**: Before calling a tool, analyze the required arguments. If you are missing data (like a \`projectId\`), ask the user or search for it.
- **Error Handling**: If a tool fails (e.g., "Data not found"), analyze the error, correct the path or arguments, and try again.
</execution_logic>
</system_instructions>
`.trim();
}
