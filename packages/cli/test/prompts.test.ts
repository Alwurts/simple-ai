import * as p from "@clack/prompts";
import { describe, expect, it, vi } from "vitest";
import { getGitChoice } from "../src/prompts/git.js";
import { getInstallChoice } from "../src/prompts/install.js";

// Mock @clack/prompts
vi.mock("@clack/prompts", () => ({
	confirm: vi.fn(),
	isCancel: vi.fn(),
}));

// Mock isInteractive to simulate non-interactive environment
vi.mock("../src/lib/validation.js", () => ({
	isInteractive: vi.fn(),
	validateProjectDirectory: vi.fn(),
}));

describe("Git Prompt", () => {
	it("should return true when user confirms git initialization", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		mockConfirm.mockResolvedValue(true);
		mockIsCancel.mockReturnValue(false);

		const result = await getGitChoice();
		expect(result).toBe(true);
		expect(mockConfirm).toHaveBeenCalledWith({
			message: "Initialize a git repository?",
			initialValue: true,
		});
	});

	it("should return false when user declines git initialization", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		mockConfirm.mockResolvedValue(false);
		mockIsCancel.mockReturnValue(false);

		const result = await getGitChoice();
		expect(result).toBe(false);
	});

	it("should throw error when user cancels", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		// Mock confirm to return a value that will be checked by isCancel
		mockConfirm.mockResolvedValue({} as unknown as boolean); // Mock cancelled value
		mockIsCancel.mockReturnValue(true);

		await expect(getGitChoice()).rejects.toThrow("Operation cancelled");
	});
});

describe("Install Prompt", () => {
	it("should return true when user confirms dependency installation", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		mockConfirm.mockResolvedValue(true);
		mockIsCancel.mockReturnValue(false);

		const result = await getInstallChoice();
		expect(result).toBe(true);
		expect(mockConfirm).toHaveBeenCalledWith({
			message: "Install dependencies?",
			initialValue: true,
		});
	});

	it("should return false when user declines dependency installation", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		mockConfirm.mockResolvedValue(false);
		mockIsCancel.mockReturnValue(false);

		const result = await getInstallChoice();
		expect(result).toBe(false);
	});

	it("should throw error when user cancels install prompt", async () => {
		const mockConfirm = vi.mocked(p.confirm);
		const mockIsCancel = vi.mocked(p.isCancel);

		// Mock confirm to return a value that will be checked by isCancel
		mockConfirm.mockResolvedValue({} as unknown as boolean); // Mock cancelled value
		mockIsCancel.mockReturnValue(true);

		await expect(getInstallChoice()).rejects.toThrow("Operation cancelled");
	});
});
