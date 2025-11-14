import path from "node:path";
import { pathExists, readJSON } from "fs-extra";
import { afterEach, describe, expect, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectFileContains,
	expectFileExists,
	expectGitInitialized,
	expectGitNotInitialized,
	expectSuccess,
	expectSuccessWithProjectDir,
	runTest,
	validatePackageJson,
} from "./test-utils.js";

describe("Basic Project Creation", () => {
	afterEach(async () => {
		await cleanupSmokeDirectory("copied-app");
		await cleanupSmokeDirectory("my-explicit-app");
		await cleanupSmokeDirectory("git-app");
		await cleanupSmokeDirectory("no-git-app");
		await cleanupSmokeDirectory("no-install-app");
		await cleanupSmokeDirectory("dotfile-app");
	});

	it("should copy the vercel template and rename the project in package.json", async () => {
		const result = await runTest({
			projectName: "copied-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);

		// Check if a known file from the template exists
		await expectFileExists(projectDir, "next.config.ts");

		// Check if package.json name was updated
		const packageJson = await readJSON(path.join(projectDir, "package.json"));
		expect(packageJson.name).toBe("copied-app");
	});

	it("should create a project with explicit name", async () => {
		const result = await runTest({
			projectName: "my-explicit-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);
		await validatePackageJson(projectDir, "my-explicit-app");
	});

	it("should initialize git repository when git option is enabled", async () => {
		const result = await runTest({
			projectName: "git-app",
			yes: true,
			install: false,
			git: true,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitInitialized(projectDir);
	});

	it("should NOT initialize git repository when git option is disabled", async () => {
		const result = await runTest({
			projectName: "no-git-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitNotInitialized(projectDir);
	});

	it("should NOT install dependencies when install option is disabled", async () => {
		const result = await runTest({
			projectName: "no-install-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);

		// Check that package-lock.json does NOT exist (it would be created by npm install)
		const packageLockExists = await pathExists(path.join(projectDir, "package-lock.json"));
		expect(packageLockExists).toBe(false);

		// node_modules exists because it's copied from the template, but no package-lock.json means npm install wasn't run
	});

	it("should create project with proper dotfiles (.gitignore and .env.example)", async () => {
		const result = await runTest({
			projectName: "dotfile-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
		const projectDir = expectSuccessWithProjectDir(result);

		// Check that dotfiles exist and have correct content
		await expectFileExists(projectDir, ".gitignore");
		await expectFileExists(projectDir, ".env.example");

		// Check .gitignore contains Next.js specific ignores
		await expectFileContains(projectDir, ".gitignore", ".next/");
		await expectFileContains(projectDir, ".gitignore", "/build");

		// Check .env.example contains required environment variables
		await expectFileContains(projectDir, ".env.example", "POSTGRES_URL");
		await expectFileContains(projectDir, ".env.example", "BETTER_AUTH_SECRET");
	});
});
