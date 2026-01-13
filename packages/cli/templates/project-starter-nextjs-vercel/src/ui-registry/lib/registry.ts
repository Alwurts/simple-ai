import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Project, ScriptKind } from "ts-morph";
import { z } from "zod";
import { Index } from "@/ui-registry/registry/__index__";
import { type registryItemFileSchema, registryItemSchema } from "@/ui-registry/registry/schema";

export function getRegistryComponent(name: string) {
	return Index[name]?.component;
}

export async function getRegistryItem(name: string) {
	const item = Index[name];

	if (!item) {
		return null;
	}

	// Convert all file paths to object.
	item.files = (item.files || []).map((file: unknown) =>
		typeof file === "string" ? { path: file } : file,
	);

	// Fail early before doing expensive file operations.
	const result = z
		.object({
			files: z.array(z.any()).optional(),
		})
		.safeParse(item);

	if (!result.success || !item.files || item.files.length === 0) {
		return null;
	}

	let files: Array<z.infer<typeof registryItemFileSchema> & { content?: string }> = [];
	for (const file of item.files) {
		const filePath = typeof file === "string" ? file : file.path;
		if (!filePath) {
			continue;
		}

		// Resolve path relative to project root
		const resolvedPath = filePath.startsWith("./src/ui-registry/")
			? path.resolve(process.cwd(), filePath)
			: path.resolve(process.cwd(), "src/ui-registry/registry", filePath);

		const content = await getFileContent({
			path: resolvedPath,
			type: typeof file === "object" ? file.type : "registry:ui",
		});

		const relativePath = path.relative(process.cwd(), resolvedPath);

		files.push({
			...(typeof file === "object" ? file : { path: filePath }),
			path: relativePath,
			content,
		});
	}

	// Fix file paths.
	files = fixFilePaths(files);

	const parsed = registryItemSchema.safeParse({
		...item,
		files,
	});

	if (!parsed.success) {
		console.error(parsed.error.message);
		return null;
	}

	return parsed.data;
}

async function getFileContent(file: { path: string; type: string }) {
	try {
		const raw = await fs.readFile(file.path, "utf-8");

		const project = new Project({
			compilerOptions: {},
		});

		const tempFile = await createTempSourceFile(file.path);
		const sourceFile = project.createSourceFile(tempFile, raw, {
			scriptKind: ScriptKind.TSX,
		});

		let code = sourceFile.getFullText();

		// Some registry items use default export.
		// We want to use named export instead.
		if (file.type !== "registry:page") {
			code = code.replaceAll("export default", "export");
		}

		// Fix imports.
		code = fixImport(code);

		return code;
	} catch (error) {
		console.error(`Error reading file ${file.path}:`, error);
		return "";
	}
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

	return target ?? "";
}

async function createTempSourceFile(filename: string) {
	const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
	return path.join(dir, path.basename(filename));
}

function fixFilePaths(files: Array<z.infer<typeof registryItemFileSchema> & { content?: string }>) {
	if (!files || files.length === 0) {
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

	const replacement = (match: string, _path: string, type: string, component: string) => {
		if (type.endsWith("components")) {
			return `@/components/${component}`;
		} else if (type.endsWith("ui")) {
			return `@/components/ui/${component}`;
		} else if (type.endsWith("hooks")) {
			return `@/hooks/${component}`;
		} else if (type.endsWith("lib")) {
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
		const filePath = file.target ?? file.path;
		const parts = filePath.split("/");
		let currentLevel = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			const existingNode = currentLevel.find((node) => node.name === part);

			if (existingNode) {
				if (isFile) {
					// Update existing file node with full path
					existingNode.path = filePath;
				} else {
					// Move to next level in the tree
					// biome-ignore lint/style/noNonNullAssertion: Ok
					currentLevel = existingNode.children!;
				}
			} else {
				const newNode: FileTree = isFile
					? { name: part, path: filePath }
					: { name: part, children: [] };

				currentLevel.push(newNode);

				if (!isFile) {
					// biome-ignore lint/style/noNonNullAssertion: Ok
					currentLevel = newNode.children!;
				}
			}
		}
	}

	return root;
}

export async function getAllRegistryItems(
	types: z.infer<typeof registryItemSchema>["type"][] = [],
	categories: string[] = [],
) {
	const index = z.record(z.string(), registryItemSchema).parse(Index);

	return Object.values(index).filter((item) => {
		const typeMatch = types.length === 0 || types.includes(item.type);
		const categoryMatch =
			categories.length === 0 || item.categories?.some((cat) => categories.includes(cat));

		return typeMatch && categoryMatch;
	});
}

export async function getAllRegistryItemIds(
	types: z.infer<typeof registryItemSchema>["type"][] = [],
	categories: string[] = [],
): Promise<string[]> {
	const items = await getAllRegistryItems(types, categories);
	return items.map((item) => item.name);
}
