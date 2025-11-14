import { afterEach, describe, it } from "vitest";
import {
	cleanupSmokeDirectory,
	expectProjectCompiles,
	expectSuccessWithProjectDir,
	runTest,
} from "./test-utils.js";

describe("Project Compilation", () => {
	afterEach(async () => {
		await cleanupSmokeDirectory("compilable-app");
	});

	it("should create a compilable project", async () => {
		const result = await runTest({
			projectName: "compilable-app",
			yes: true,
			install: true, // Actually install dependencies
			git: false,
		});

		const projectDir = expectSuccessWithProjectDir(result);
		await expectProjectCompiles(projectDir);
	}, 120000); // 2 minute timeout
});
