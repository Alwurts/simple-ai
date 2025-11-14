import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PackageManager, ProjectConfig } from "../types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TEMPLATES_DIR = __dirname.endsWith("/dist")
	? __dirname
	: path.resolve(__dirname, "../../templates");

export const DEFAULT_CLI_CONFIG_BASE: Omit<ProjectConfig, "projectDir"> = {
	projectName: "my-app",
	framework: "nextjs",
	packageManager: "npm",
	git: true,
	install: true,
};

export const CLI_NAME = "create-simple-ai";
export const CLI_DESCRIPTION = "Create simple AI-powered full-stack applications";

export const PACKAGE_MANAGER_COMMANDS: Record<
	PackageManager,
	{
		install: [string, string[]];
		add: (deps: string[], dev: boolean) => [string, string[]];
		run: (script: string) => [string, string[]];
	}
> = {
	npm: {
		install: ["npm", ["install"]],
		add: (deps, dev = false) => ["npm", ["install", ...(dev ? ["-D"] : []), ...deps]],
		run: (script) => ["npm", ["run", script]],
	},
	pnpm: {
		install: ["pnpm", ["install"]],
		add: (deps, dev = false) => ["pnpm", ["add", ...(dev ? ["-D"] : []), ...deps]],
		run: (script) => ["pnpm", ["run", script]],
	},
	bun: {
		install: ["bun", ["install"]],
		add: (deps, dev = false) => ["bun", ["add", ...(dev ? ["-D"] : []), ...deps]],
		run: (script) => ["bun", ["run", script]],
	},
} as const;
