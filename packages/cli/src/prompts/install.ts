import * as p from "@clack/prompts";

export async function getInstallChoice(): Promise<boolean> {
	const install = await p.confirm({
		message: "Install dependencies?",
		initialValue: true,
	});

	if (p.isCancel(install)) {
		throw new Error("Operation cancelled");
	}

	return install;
}
