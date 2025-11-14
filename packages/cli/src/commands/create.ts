import path from "node:path";
import pc from "picocolors";
import { setupProject } from "../core/project-setup.js";
import { logger } from "../lib/logger.js";
import { getPackageManagerCommand } from "../lib/package-manager.js";
import { isInteractive, validateProjectDirectory } from "../lib/validation.js";
import { getGitChoice } from "../prompts/git.js";
import { getProjectName } from "../prompts/project-name.js";
import type { CLIOptions, ProjectConfig } from "../types.js";
import { ProjectConfigSchema } from "../types.js";

export async function createCommand(projectName?: string, options: CLIOptions = {}) {
	logger.info(pc.magenta("🚀 Creating a new application"));

	try {
		const config = await gatherConfiguration(projectName, options);

		const validatedConfig = ProjectConfigSchema.parse(config);

		await validateProjectDirectory(validatedConfig);

		await setupProject(validatedConfig);

		logger.success(pc.green("✅ Project created successfully!"));

		await showNextSteps(validatedConfig);
	} catch (error) {
		logger.error("Failed to create project");
		throw error;
	}
}

async function gatherConfiguration(
	projectName?: string,
	options: CLIOptions = {},
): Promise<ProjectConfig> {
	const finalProjectName =
		options.yes && projectName ? projectName : await getProjectName(projectName);

	const projectDir = path.resolve(process.cwd(), finalProjectName);

	const framework = "nextjs";
	const packageManager = "npm";

	let install: boolean;
	if (options.install === true) {
		install = true;
	} else if (options.install === false) {
		install = false;
	} else {
		// Install dependencies by default
		install = true;
	}

	let git: boolean;
	if (options.git === true) {
		git = true;
	} else if (options.git === false) {
		git = false;
	} else if (options.yes) {
		git = true;
	} else if (isInteractive()) {
		git = await getGitChoice();
	} else {
		throw new Error(
			"Git initialization must be specified with --git or --no-git when not in interactive mode. Use --yes to use default settings.",
		);
	}

	const config: ProjectConfig = {
		projectName: finalProjectName,
		projectDir,
		framework,
		git,
		install,
		packageManager,
	};

	return config;
}

async function showNextSteps(config: ProjectConfig): Promise<void> {
	console.log(`\n${pc.blue("📝 Next steps:")}`);
	console.log(`  cd ${config.projectName}`);

	if (!config.install) {
		const installCommand = await getPackageManagerCommand(config.packageManager, "install");
		console.log(`  ${installCommand.join(" ")}`);
	}

	const runCommand = await getPackageManagerCommand(config.packageManager, "run", "dev");
	console.log(`  ${runCommand.join(" ")}`);
	console.log(`\n${pc.green("🎉 Happy coding!")}`);
}
