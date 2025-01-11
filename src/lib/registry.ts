import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Index } from "@/__registry__";
import { Project, ScriptKind, type SourceFile } from "ts-morph";
import type { z } from "zod";

import {
	type registryItemFileSchema,
	registryItemSchema,
} from "@/registry/schema";

const memoizedIndex: typeof Index = Object.fromEntries(
	Object.entries(Index).map(([name, items]) => [name, { ...items }]),
);

export function getRegistryComponent(name: string) {
	return memoizedIndex[name]?.component;
}

export async function getRegistryItem(name: string) {
	const item = memoizedIndex[name];

	if (!item) {
		return null;
	}

	// Convert all file paths to object.
	// TODO: remove when we migrate to new registry.
	item.files = item.files.map((file: unknown) =>
		typeof file === "string" ? { path: file } : file,
	);

	// Fail early before doing expensive file operations.
	const result = registryItemSchema.safeParse(item);
	if (!result.success) {
		return null;
	}

	let files: typeof result.data.files = [];
	for (const file of item.files) {
		const content = await getFileContent(file);
		const relativePath = path.relative(process.cwd(), file.path);

		files.push({
			...file,
			path: relativePath,
			content,
		});
	}

	// Get meta.
	// Assume the first file is the main file.
	// const meta = await getFileMeta(files[0].path)

	// Fix file paths.
	files = fixFilePaths(files);

	const parsed = registryItemSchema.safeParse({
		...result.data,
		files,
		// meta,
	});

	if (!parsed.success) {
		console.error(parsed.error.message);
		return null;
	}

	return parsed.data;
}

async function getFileContent(file: z.infer<typeof registryItemFileSchema>) {
	const raw = await fs.readFile(file.path, "utf-8");

	const project = new Project({
		compilerOptions: {},
	});

	const tempFile = await createTempSourceFile(file.path);
	const sourceFile = project.createSourceFile(tempFile, raw, {
		scriptKind: ScriptKind.TSX,
	});

	// Remove meta variables.
	removeVariable(sourceFile, "iframeHeight");
	removeVariable(sourceFile, "containerClassName");
	removeVariable(sourceFile, "description");

	let code = sourceFile.getFullText();

	// Some registry items uses default export.
	// We want to use named export instead.
	// TODO: do we really need this? - @shadcn.
	if (file.type !== "registry:page") {
		code = code.replaceAll("export default", "export");
	}

	// Fix imports.
	code = fixImport(code);

	return code;
}

function getFileTarget(file: z.infer<typeof registryItemFileSchema>) {
	let target = file.target;

	if (!target || target === "") {
		const fileName = file.path.split("/").pop();
		if (
			file.type === "registry:block" ||
			file.type === "registry:component" ||
			file.type === "registry:example"
		) {
			target = `components/${fileName}`;
		}

		if (file.type === "registry:ui") {
			target = `components/ui/${fileName}`;
		}

		if (file.type === "registry:hook") {
			target = `hooks/${fileName}`;
		}

		if (file.type === "registry:lib") {
			target = `lib/${fileName}`;
		}
	}

	return target;
}

async function createTempSourceFile(filename: string) {
	const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
	return path.join(dir, filename);
}

function removeVariable(sourceFile: SourceFile, name: string) {
	sourceFile.getVariableDeclaration(name)?.remove();
}

function fixFilePaths(files: z.infer<typeof registryItemSchema>["files"]) {
	if (!files) {
		return [];
	}

	// Resolve all paths relative to the first file's directory.
	const firstFilePath = files[0].path;
	const firstFilePathDir = path.dirname(firstFilePath);

	return files.map((file) => {
		return {
			...file,
			path: path.relative(firstFilePathDir, file.path),
			target: getFileTarget(file),
		};
	});
}

export function fixImport(content: string) {
	const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g;

	const replacement = (
		match: string,
		_: string,
		type: string,
		component: string,
	) => {
		if (type.endsWith("components")) {
			return `@/components/${component}`;
		}
		if (type.endsWith("ui")) {
			return `@/components/ui/${component}`;
		}

		if (type.endsWith("hooks")) {
			return `@/hooks/${component}`;
		}

		if (type.endsWith("lib")) {
			return `@/lib/${component}`;
		}

		return match;
	};

	return content.replace(regex, replacement);
}

export type FileTree = {
	name: string;
	path?: string;
	children?: FileTree[];
};

export function createFileTreeForRegistryItemFiles(
	files: Array<{ path: string; target?: string }>,
) {
	const root: FileTree[] = [];

	for (const file of files) {
		const path = file.target ?? file.path;
		const parts = path.split("/");
		let currentLevel = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			const existingNode = currentLevel.find((node) => node.name === part);

			if (existingNode) {
				if (isFile) {
					// Update existing file node with full path
					existingNode.path = path;
				} else {
					// Move to next level in the tree
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					currentLevel = existingNode.children!;
				}
			} else {
				const newNode: FileTree = isFile
					? { name: part, path }
					: { name: part, children: [] };

				currentLevel.push(newNode);

				if (!isFile) {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					currentLevel = newNode.children!;
				}
			}
		}
	}

	return root;
}
