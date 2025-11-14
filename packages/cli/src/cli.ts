import { Command } from "commander";
import { createCommand } from "./commands/create.js";
import { CLI_DESCRIPTION, CLI_NAME } from "./lib/config.js";
import { handleError } from "./lib/error-handler.js";

const program = new Command();

program
	.name(CLI_NAME)
	.description(CLI_DESCRIPTION)
	.argument("[project-name]", "Name of the project to create")
	.option("-y, --yes", "Skip prompts and use default options", false)
	.option("-g, --git", "Initialize a git repository")
	.option("--no-git", "Skip Git initialization", false)
	.option("-i, --install", "Install dependencies")
	.option("--no-install", "Skip dependency installation", false)
	.action(async (projectName, options) => {
		try {
			await createCommand(projectName, options);
		} catch (error) {
			handleError(error);
			process.exit(1);
		}
	});

// Handle unhandled promise rejections
process.on("unhandledRejection", error => {
	handleError(error);
	process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", error => {
	handleError(error);
	process.exit(1);
});

program.parse();
