import { execa } from "execa";
import { logger } from "./logger.js";

export async function initializeGit(projectDir: string): Promise<void> {
	try {
		// Initialize git repository
		await execa("git", ["init"], { cwd: projectDir });

		// Add all files
		await execa("git", ["add", "."], { cwd: projectDir });

		// Initial commit
		await execa("git", ["commit", "-m", "Initial commit"], { cwd: projectDir });

		logger.success("Git repository initialized");
	} catch (_error) {
		logger.warning(
			"Failed to initialize git repository (git may not be installed)",
		);
	}
}
