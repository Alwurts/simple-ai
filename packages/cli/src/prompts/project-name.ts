import * as p from "@clack/prompts";
import { ProjectNameSchema } from "../types.js";

export async function getProjectName(providedName?: string): Promise<string> {
	if (providedName) {
		// Validate provided name
		const result = ProjectNameSchema.safeParse(providedName);
		if (!result.success) {
			throw new Error(
				`Invalid project name: ${result.error.issues[0]?.message}`,
			);
		}
		return providedName;
	}

	const name = await p.text({
		message: "What will your project be called?",
		placeholder: "my-app",
		validate: value => {
			const result = ProjectNameSchema.safeParse(value);
			if (!result.success) {
				return result.error.issues[0]?.message || "Invalid project name";
			}
		},
	});

	if (p.isCancel(name)) {
		throw new Error("Operation cancelled");
	}

	return name;
}
