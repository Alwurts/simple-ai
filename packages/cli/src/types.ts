import { z } from "zod";

export const FRAMEWORKS = ["nextjs"] as const;
export const PACKAGE_MANAGERS = ["npm", "pnpm", "bun"] as const;

export const FrameworkSchema = z.enum(FRAMEWORKS);
export const PackageManagerSchema = z.enum(PACKAGE_MANAGERS);

export const ProjectNameSchema = z
	.string()
	.min(1, "Project name cannot be empty")
	.max(255, "Project name must be less than 255 characters")
	.refine(
		(name) => name === "." || !name.startsWith("."),
		"Project name cannot start with a dot (except for '.')",
	)
	.refine((name) => name === "." || !name.startsWith("-"), "Project name cannot start with a dash")
	.refine((name) => {
		const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
		return !invalidChars.some((char) => name.includes(char));
	}, "Project name contains invalid characters")
	.refine((name) => name.toLowerCase() !== "node_modules", "Project name is reserved");

export type Framework = z.infer<typeof FrameworkSchema>;
export type PackageManager = z.infer<typeof PackageManagerSchema>;

export interface CLIOptions {
	projectName?: string;
	git?: boolean;
	install?: boolean;
	packageManager?: PackageManager;
	yes?: boolean; // Skip prompts, use defaults
}

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

export const ProjectConfigSchema = z.object({
	projectName: ProjectNameSchema,
	projectDir: z.string(),
	framework: FrameworkSchema,
	git: z.boolean(),
	install: z.boolean(),
	packageManager: PackageManagerSchema,
});

export type Installer = (config: ProjectConfig) => Promise<void>;
