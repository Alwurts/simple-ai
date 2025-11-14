#!/usr/bin/env node

import { join } from "node:path";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

interface CheckResult {
	name: string;
	passed: boolean;
	message?: string;
}

const checks: CheckResult[] = [];

async function runCheck(name: string, checkFn: () => Promise<boolean | string>): Promise<void> {
	try {
		const result = await checkFn();
		if (result === true) {
			checks.push({ name, passed: true });
			console.log(pc.green(`✓ ${name}`));
		} else if (typeof result === "string") {
			checks.push({ name, passed: false, message: result });
			console.log(pc.red(`✗ ${name}: ${result}`));
		} else {
			checks.push({ name, passed: false });
			console.log(pc.red(`✗ ${name}`));
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		checks.push({ name, passed: false, message });
		console.log(pc.red(`✗ ${name}: ${message}`));
	}
}

async function checkTests(): Promise<boolean | string> {
	try {
		await execa("npm", ["run", "test:run"], { stdio: "pipe" });
		return true;
	} catch {
		return "Tests failed. Run 'npm run test:run' to see details.";
	}
}

async function checkBuild(): Promise<boolean | string> {
	try {
		await execa("npm", ["run", "build"], { stdio: "pipe" });
		return true;
	} catch {
		return "Build failed. Run 'npm run build' to see details.";
	}
}

async function checkLint(): Promise<boolean | string> {
	try {
		await execa("npm", ["run", "lint"], { stdio: "pipe" });
		return true;
	} catch {
		return "Linting failed. Run 'npm run lint' to see details.";
	}
}

async function checkTypecheck(): Promise<boolean | string> {
	try {
		await execa("npm", ["run", "typecheck"], { stdio: "pipe" });
		return true;
	} catch {
		return "Type checking failed. Run 'npm run typecheck' to see details.";
	}
}

async function checkGitClean(): Promise<boolean | string> {
	try {
		const { stdout } = await execa("git", ["status", "--porcelain"], {
			stdio: "pipe",
		});

		// Filter out changeset files - they're expected to be uncommitted during release
		const uncommittedFiles = stdout
			.trim()
			.split("\n")
			.filter(line => line.trim())
			.filter(line => !line.includes(".changeset/"));

		if (uncommittedFiles.length > 0) {
			return `You have uncommitted changes (excluding changesets). Commit or stash them before releasing:\n${uncommittedFiles.join("\n")}`;
		}
		return true;
	} catch {
		return "Failed to check git status.";
	}
}

async function checkGitBranch(): Promise<boolean | string> {
	try {
		const { stdout } = await execa("git", ["branch", "--show-current"], {
			stdio: "pipe",
		});
		const branch = stdout.trim();
		if (branch !== "main") {
			return `You are on branch '${branch}'. Releases should be made from 'main'.`;
		}
		return true;
	} catch {
		return "Failed to check git branch.";
	}
}

async function checkNpmAuth(): Promise<boolean | string> {
	try {
		await execa("npm", ["whoami"], { stdio: "pipe" });
		return true;
	} catch {
		return "Not authenticated with npm. Run 'npm login' first.";
	}
}

async function checkPackageJson(): Promise<boolean | string> {
	try {
		const packageJsonPath = join(process.cwd(), "package.json");
		const content = await fs.readFile(packageJsonPath, "utf-8");
		JSON.parse(content);
		return true;
	} catch {
		return "CLI package.json is invalid or cannot be read.";
	}
}

async function checkTemplates(): Promise<boolean | string> {
	const templatesPath = join(process.cwd(), "templates");
	const exists = await fs.pathExists(templatesPath);
	if (!exists) {
		return "packages/cli/templates/ directory not found.";
	}
	return true;
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);
	const isDryRun = args.includes("--dry-run");
	const skipValidation = args.includes("--no-validate");

	if (skipValidation) {
		console.log(pc.yellow("⚠ Skipping validation checks"));
		process.exit(0);
	}

	console.log(pc.blue("🔍 Running pre-release checks...\n"));

	if (isDryRun) {
		console.log(pc.yellow("(DRY RUN MODE - Checks will run but won't fail)\n"));
	}

	// Code quality checks
	await runCheck("Tests pass", checkTests);
	await runCheck("Build succeeds", checkBuild);
	await runCheck("Linting passes", checkLint);
	await runCheck("Type checking passes", checkTypecheck);

	// Git checks
	await runCheck("Git working directory clean", checkGitClean);
	await runCheck("On correct branch (main/master)", checkGitBranch);

	// NPM checks
	await runCheck("NPM authenticated", checkNpmAuth);

	// Project state checks
	await runCheck("package.json is valid", checkPackageJson);
	await runCheck("Templates directory exists", checkTemplates);

	console.log();

	const failedChecks = checks.filter(check => !check.passed);

	if (failedChecks.length > 0) {
		console.log(pc.red(`\n❌ ${failedChecks.length} check(s) failed:\n`));
		for (const check of failedChecks) {
			console.log(pc.red(`  • ${check.name}`));
			if (check.message) {
				console.log(pc.gray(`    ${check.message}`));
			}
		}

		if (!isDryRun) {
			console.log(
				pc.yellow("\n💡 Tip: Use --dry-run to see what would be checked without failing"),
			);
			process.exit(1);
		} else {
			console.log(pc.yellow("\n⚠ Dry-run mode: Continuing despite failures"));
		}
	} else {
		console.log(pc.green(`\n✅ All ${checks.length} checks passed!`));
	}
}

main().catch(error => {
	console.error(pc.red("Fatal error:"), error);
	process.exit(1);
});
