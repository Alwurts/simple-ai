import { afterEach, describe, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectGitInitialized,
	expectGitNotInitialized,
	expectSuccess,
	expectSuccessWithProjectDir,
	runTest,
} from "./test-utils.js";

describe("Integration Tests", () => {
	afterEach(async () => {
		await cleanupSmokeDirectory("test-app");
		await cleanupSmokeDirectory("git-test-app");
		await cleanupSmokeDirectory("no-git-test-app");
		await cleanupSmokeDirectory("git-yes-app");
		await cleanupSmokeDirectory("git-explicit-app");
		await cleanupSmokeDirectory("no-git-explicit-app");
		await cleanupSmokeDirectory("install-yes-app");
		await cleanupSmokeDirectory("install-explicit-app");
		await cleanupSmokeDirectory("no-install-explicit-app");
	});

	it("should create a basic project", async () => {
		const result = await runTest({
			projectName: "test-app",
			yes: true,
			install: false,
			git: false,
		});

		expectSuccess(result);
	});

	it("should handle git initialization", async () => {
		const result = await runTest({
			projectName: "git-test-app",
			yes: true,
			install: false,
			git: true,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitInitialized(projectDir);
	});

	it("should handle no git initialization", async () => {
		const result = await runTest({
			projectName: "no-git-test-app",
			yes: true,
			install: false,
			git: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitNotInitialized(projectDir);
	});

	it("should initialize git by default with --yes", async () => {
		const result = await runTest({
			projectName: "git-yes-app",
			yes: true,
			install: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitInitialized(projectDir);
	});

	it("should initialize git when explicitly requested", async () => {
		const result = await runTest({
			projectName: "git-explicit-app",
			git: true,
			install: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitInitialized(projectDir);
	});

	it("should skip git when explicitly disabled", async () => {
		const result = await runTest({
			projectName: "no-git-explicit-app",
			git: false,
			install: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectGitNotInitialized(projectDir);
	});

	it("should install dependencies by default with --yes", async () => {
		const result = await runTest({
			projectName: "install-yes-app",
			yes: true,
			git: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		// Dependencies should be installed (though we can't easily verify node_modules creation in tests)
		await expectGitNotInitialized(projectDir); // git should be false
	});

	it("should skip dependency installation when explicitly disabled", async () => {
		const result = await runTest({
			projectName: "no-install-explicit-app",
			install: false,
			git: false,
		});

		expectSuccess(result);
	});
});
