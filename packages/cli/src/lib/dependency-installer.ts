import { execa } from "execa";
import { PACKAGE_MANAGER_COMMANDS } from "../lib/config.js";
import { logger } from "../lib/logger.js";
import type { ProjectConfig } from "../types.js";

export async function installDependencies(
	config: ProjectConfig,
): Promise<void> {
	const [cmd, args] = PACKAGE_MANAGER_COMMANDS[config.packageManager].install;

	logger.info(`Installing dependencies with ${config.packageManager}...`);

	try {
		await execa(cmd, args, {
			cwd: config.projectDir,
			stdio: "inherit",
		});
		logger.success("Dependencies installed successfully");
	} catch (error) {
		logger.error(`Failed to install dependencies: ${error}`);
		throw error;
	}
}

export async function addDependencies(
	projectDir: string,
	packageManager: ProjectConfig["packageManager"],
	dependencies: Record<string, string>,
	dev = false,
): Promise<void> {
	const deps = Object.entries(dependencies).map(
		([name, version]) => `${name}@${version}`,
	);
	const commandArray = PACKAGE_MANAGER_COMMANDS[packageManager].add(deps, dev);
	const cmd = commandArray[0] as string;
	const args = commandArray[1] as readonly string[];

	await execa(cmd, args, {
		cwd: projectDir,
		stdio: "inherit",
	});
}
