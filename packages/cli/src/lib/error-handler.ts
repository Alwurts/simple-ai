import pc from "picocolors";

export function handleError(error: unknown): void {
	const message = error instanceof Error ? error.message : String(error);

	console.error(pc.red("✗ Error:"), message);

	if (error instanceof Error && error.stack && process.env.DEBUG) {
		console.error(pc.gray("\nStack trace:"));
		console.error(error.stack);
	}

	console.error(pc.yellow("\nFor help, visit: https://github.com/your-repo/issues"));
}

export class CLIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = "CLIError";
	}
}

export function exitWithError(message: string, code = 1): never {
	console.error(pc.red("✗ Error:"), message);
	process.exit(code);
}
