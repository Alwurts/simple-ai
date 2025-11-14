import path from "node:path";
import fs from "fs-extra";
import { TEMPLATES_DIR } from "../lib/config.js";
import { installDependencies } from "../lib/dependency-installer.js";
import { initializeGit } from "../lib/git.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function setupProject(config: ProjectConfig): Promise<void> {
	logger.info(`Setting up project: ${config.projectName}`);

	try {
		// 1. Create project directory
		await fs.ensureDir(config.projectDir);

		// 2. Define source and destination
		const templateName = "project-starter-nextjs-vercel"; // Hardcoded for now
		const templateDir = path.join(TEMPLATES_DIR, templateName);

		// 3. Copy the template project
		logger.info(`Copying starter template from ${templateName}...`);
		await fs.copy(templateDir, config.projectDir);

		// 4. Rename dotfiles back to their proper names (Git doesn't track dotfiles well)
		const gitignoreSrc = path.join(config.projectDir, "gitignore");
		const gitignoreDest = path.join(config.projectDir, ".gitignore");
		if (await fs.pathExists(gitignoreSrc)) {
			await fs.rename(gitignoreSrc, gitignoreDest);
		}

		const envExampleSrc = path.join(config.projectDir, "env.example");
		const envExampleDest = path.join(config.projectDir, ".env.example");
		if (await fs.pathExists(envExampleSrc)) {
			await fs.rename(envExampleSrc, envExampleDest);
		}

		// 5. Copy .env.example to .env.local for local development
		const envLocalDest = path.join(config.projectDir, ".env.local");
		if (await fs.pathExists(envExampleDest)) {
			await fs.copy(envExampleDest, envLocalDest);
		}

		// 7. Post-process: Update package.json
		const packageJsonPath = path.join(config.projectDir, "package.json");
		const packageJson = await fs.readJSON(packageJsonPath);
		packageJson.name = config.projectName;
		await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });

		// 8. Install dependencies
		if (config.install) {
			await installDependencies(config);
		}

		// 9. Initialize Git repository
		if (config.git) {
			await initializeGit(config.projectDir);
		}
	} catch (error) {
		// Clean up on failure
		try {
			await fs.remove(config.projectDir);
		} catch {
			// Ignore cleanup errors
		}
		throw error;
	}
}
