import { rm } from "node:fs/promises";
import { join } from "node:path";
import { execa } from "execa";
import { pathExists, readFile, readJSON } from "fs-extra";
import { expect } from "vitest";
import { setupProject } from "../src/core/project-setup.js";
import type { CLIOptions } from "../src/types.js";

export interface TestResult {
	success: boolean;
	projectDir?: string;
	error?: string;
	config: TestConfig;
}

export interface TestConfig
	extends Omit<CLIOptions, "packageManager" | "database"> {
	projectName: string;
	expectError?: boolean;
	expectedErrorMessage?: string;
}

/**
 * Clean up the entire .smoke directory
 */
export async function cleanupSmokeDirectory(
	projectName?: string,
): Promise<void> {
	const smokeDir = projectName
		? join(process.cwd(), ".smoke", projectName)
		: join(process.cwd(), ".smoke");
	try {
		await rm(smokeDir, { recursive: true, force: true });
	} catch (error) {
		// Ignore cleanup errors but log them for debugging
		console.warn(`Cleanup warning for ${smokeDir}: ${error}`);
	}
}

/**
 * Run a test by calling createCommand directly
 * This is simpler than subprocess execution and tests the actual code
 */
export async function runTest(config: TestConfig): Promise<TestResult> {
	const smokeDir = join(process.cwd(), ".smoke", config.projectName);
	const projectDir = join(smokeDir, config.projectName);

	try {
		// Ensure smoke directory exists
		const { ensureDir } = await import("fs-extra");
		await ensureDir(smokeDir);

		// Create a modified config that uses the smoke directory as the base
		// Apply the same defaulting logic as the actual create command
		const git = (() => {
			if (config.git === true) {
				return true;
			}
			if (config.git === false) {
				return false;
			}
			if (config.yes) {
				return true;
			}
			return false; // Default for tests when neither git option nor yes is specified
		})();

		const testConfig = {
			projectName: config.projectName,
			projectDir,
			framework: "nextjs" as const,
			git,
			install: config.install ?? false,
			packageManager: "npm" as const,
		};

		await setupProject(testConfig);

		// Verify project was created
		const projectExists = await pathExists(projectDir);

		return {
			success: projectExists,
			projectDir: projectExists ? projectDir : undefined,
			config,
		};
	} catch (error) {
		console.error(`Test failed for ${config.projectName}:`, error);
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
			config,
		};
	}
}

/**
 * Assert that a test result was successful
 */
export function expectSuccess(result: TestResult): void {
	if (!result.success) {
		console.error("Test failed:");
		console.error("Error:", result.error);
	}
	expect(result.success).toBe(true);
	expect(result.projectDir).toBeDefined();
}

/**
 * Assert that a test result was successful and return the project directory
 */
export function expectSuccessWithProjectDir(result: TestResult): string {
	expectSuccess(result);
	expect(result.projectDir).toBeDefined();
	return result.projectDir as string;
}

/**
 * Validate that a file exists in the project
 */
export async function expectFileExists(
	projectDir: string,
	filePath: string,
): Promise<void> {
	const fullPath = join(projectDir, filePath);
	const exists = await pathExists(fullPath);
	expect(exists).toBe(true);
}

/**
 * Validate that git repository was initialized
 */
export async function expectGitInitialized(projectDir: string): Promise<void> {
	const gitDir = join(projectDir, ".git");
	const exists = await pathExists(gitDir);
	expect(exists).toBe(true);
}

/**
 * Validate that git repository was NOT initialized
 */
export async function expectGitNotInitialized(
	projectDir: string,
): Promise<void> {
	const gitDir = join(projectDir, ".git");
	const exists = await pathExists(gitDir);
	expect(exists).toBe(false);
}

/**
 * Validate that a file contains expected content
 */
export async function expectFileContains(
	projectDir: string,
	filePath: string,
	expectedContent: string | RegExp,
): Promise<void> {
	const fullPath = join(projectDir, filePath);
	const content = await readFile(fullPath, "utf-8");

	if (typeof expectedContent === "string") {
		expect(content).toContain(expectedContent);
	} else {
		expect(content).toMatch(expectedContent);
	}
}

/**
 * Validate package.json structure and content
 */
export async function validatePackageJson(
	projectDir: string,
	expectedName: string,
): Promise<void> {
	const packageJsonPath = join(projectDir, "package.json");
	await expectFileExists(projectDir, "package.json");

	const packageJson = await readJSON(packageJsonPath);

	expect(packageJson.name).toBe(expectedName);
	expect(packageJson.private).toBe(true);
	expect(packageJson.scripts).toBeDefined();
	expect(packageJson.scripts.dev).toBeDefined();
	expect(packageJson.scripts.build).toBeDefined();
}

/**
 * Validate database configuration files (simple structural check)
 */
export async function validateDatabaseConfig(
	projectDir: string,
): Promise<void> {
	// Just check that drizzle config exists
	await expectFileExists(projectDir, "drizzle.config.ts");

	// Check that basic schema files exist
	await expectFileExists(projectDir, "src/db/schema/index.ts");
	await expectFileExists(projectDir, "src/db/index.ts");
}

/**
 * Validate auth setup
 */
export async function validateAuthSetup(projectDir: string): Promise<void> {
	await expectFileExists(projectDir, "src/lib/auth.ts");
	await expectFileExists(projectDir, "src/lib/auth-client.ts");
	await expectFileExists(projectDir, "src/db/schema/auth.ts");

	// Check auth config imports better-auth
	await expectFileContains(projectDir, "src/lib/auth.ts", "better-auth");
}

/**
 * Validate core project structure
 */
export async function validateProjectStructure(
	projectDir: string,
): Promise<void> {
	// Core files
	await expectFileExists(projectDir, "package.json");
	await expectFileExists(projectDir, "tsconfig.json");
	await expectFileExists(projectDir, "README.md");
	await expectFileExists(projectDir, ".env.example");
	await expectFileExists(projectDir, ".gitignore");

	// Next.js files
	await expectFileExists(projectDir, "src/app/layout.tsx");
	await expectFileExists(projectDir, "src/app/(protected)/page.tsx");
	await expectFileExists(projectDir, "src/app/globals.css");

	// Library files
	await expectFileExists(projectDir, "src/lib/utils.ts");
	await expectFileExists(projectDir, "src/lib/config.ts");
}

/**
 * Validate package.json structure and dependencies (structural, not version-specific)
 */
export async function validatePackageJsonDependencies(
	projectDir: string,
): Promise<void> {
	const packageJson = await readJSON(join(projectDir, "package.json"));

	// Check for core framework dependencies (existence, not versions)
	expect(packageJson.dependencies).toHaveProperty("next");
	expect(packageJson.dependencies).toHaveProperty("react");
	expect(packageJson.dependencies).toHaveProperty("better-auth");

	// Check for build scripts
	expect(packageJson.scripts).toHaveProperty("dev");
	expect(packageJson.scripts).toHaveProperty("build");
	expect(packageJson.scripts.build).toContain("next build");
}

/**
 * Validate that a project can be installed and built successfully
 */
export async function expectProjectCompiles(projectDir: string): Promise<void> {
	// Set up dummy environment variables for testing
	const envVars = {
		BETTER_AUTH_SECRET: "test-secret-for-compilation",
		POSTGRES_URL: "postgresql://user:pass@localhost:5432/test", // Default for the template
	};

	// Test npm install
	try {
		await execa("npm", ["install"], {
			cwd: projectDir,
			stdio: "pipe",
			timeout: 120000, // 2 minute timeout for slow installs
		});
	} catch (error) {
		throw new Error(`npm install failed: ${error}`);
	}

	// Test npm run build with environment variables
	try {
		await execa("npm", ["run", "build"], {
			cwd: projectDir,
			stdio: "pipe",
			timeout: 120000, // 2 minute timeout
			env: { ...process.env, ...envVars },
		});
	} catch (error) {
		throw new Error(`npm run build failed: ${error}`);
	}
}
