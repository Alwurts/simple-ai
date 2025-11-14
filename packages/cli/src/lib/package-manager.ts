import type { PackageManager } from "../types.js";

export async function detectPackageManager(): Promise<PackageManager> {
	// For now, we only support npm
	// Package manager detection can be added back later
	return "npm";
}

export async function getPackageManagerCommand(
	packageManager: PackageManager,
	command: "install" | "run",
	script?: string,
): Promise<string[]> {
	const commands = {
		npm: {
			install: ["npm", "install"],
			run: ["npm", "run", script || ""],
		},
		pnpm: {
			install: ["pnpm", "install"],
			run: ["pnpm", "run", script || ""],
		},
		bun: {
			install: ["bun", "install"],
			run: ["bun", "run", script || ""],
		},
	};

	return commands[packageManager][command];
}
