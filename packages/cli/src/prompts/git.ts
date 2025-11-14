import * as p from "@clack/prompts";

export async function getGitChoice(): Promise<boolean> {
	const git = await p.confirm({
		message: "Initialize a git repository?",
		initialValue: true,
	});

	if (p.isCancel(git)) {
		throw new Error("Operation cancelled");
	}

	return git;
}
