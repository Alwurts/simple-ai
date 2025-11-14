#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/create.ts
import path3 from "path";
import pc3 from "picocolors";

// src/core/project-setup.ts
import path2 from "path";
import fs from "fs-extra";

// src/lib/config.ts
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var TEMPLATES_DIR = __dirname.endsWith("/dist") ? __dirname : path.resolve(__dirname, "../templates");
var CLI_NAME = "create-simple-ai";
var CLI_DESCRIPTION = "Create simple AI-powered full-stack applications";
var PACKAGE_MANAGER_COMMANDS = {
  npm: {
    install: ["npm", ["install"]],
    add: (deps, dev = false) => ["npm", ["install", ...dev ? ["-D"] : [], ...deps]],
    run: (script) => ["npm", ["run", script]]
  },
  pnpm: {
    install: ["pnpm", ["install"]],
    add: (deps, dev = false) => ["pnpm", ["add", ...dev ? ["-D"] : [], ...deps]],
    run: (script) => ["pnpm", ["run", script]]
  },
  bun: {
    install: ["bun", ["install"]],
    add: (deps, dev = false) => ["bun", ["add", ...dev ? ["-D"] : [], ...deps]],
    run: (script) => ["bun", ["run", script]]
  }
};

// src/lib/dependency-installer.ts
import { execa } from "execa";

// src/lib/logger.ts
import pc from "picocolors";
var logger = {
  info: (message) => console.log(pc.blue("\u2139"), message),
  success: (message) => console.log(pc.green("\u2705"), message),
  warning: (message) => console.log(pc.yellow("\u26A0"), message),
  error: (message) => console.log(pc.red("\u2717"), message)
};

// src/lib/dependency-installer.ts
async function installDependencies(config) {
  const [cmd, args] = PACKAGE_MANAGER_COMMANDS[config.packageManager].install;
  logger.info(`Installing dependencies with ${config.packageManager}...`);
  try {
    await execa(cmd, args, {
      cwd: config.projectDir,
      stdio: "inherit"
    });
    logger.success("Dependencies installed successfully");
  } catch (error) {
    logger.error(`Failed to install dependencies: ${error}`);
    throw error;
  }
}

// src/lib/git.ts
import { execa as execa2 } from "execa";
async function initializeGit(projectDir) {
  try {
    await execa2("git", ["init"], { cwd: projectDir });
    await execa2("git", ["add", "."], { cwd: projectDir });
    await execa2("git", ["commit", "-m", "Initial commit"], { cwd: projectDir });
    logger.success("Git repository initialized");
  } catch (_error) {
    logger.warning("Failed to initialize git repository (git may not be installed)");
  }
}

// src/core/project-setup.ts
async function setupProject(config) {
  logger.info(`Setting up project: ${config.projectName}`);
  try {
    await fs.ensureDir(config.projectDir);
    const templateName = "project-starter-nextjs-vercel";
    const templateDir = path2.join(TEMPLATES_DIR, templateName);
    logger.info(`Copying starter template from ${templateName}...`);
    await fs.copy(templateDir, config.projectDir);
    const gitignoreSrc = path2.join(config.projectDir, "gitignore");
    const gitignoreDest = path2.join(config.projectDir, ".gitignore");
    if (await fs.pathExists(gitignoreSrc)) {
      await fs.rename(gitignoreSrc, gitignoreDest);
    }
    const envExampleSrc = path2.join(config.projectDir, "env.example");
    const envExampleDest = path2.join(config.projectDir, ".env.example");
    if (await fs.pathExists(envExampleSrc)) {
      await fs.rename(envExampleSrc, envExampleDest);
    }
    const packageJsonPath = path2.join(config.projectDir, "package.json");
    const packageJson = await fs.readJSON(packageJsonPath);
    packageJson.name = config.projectName;
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    if (config.install) {
      await installDependencies(config);
    }
    if (config.git) {
      await initializeGit(config.projectDir);
    }
  } catch (error) {
    try {
      await fs.remove(config.projectDir);
    } catch {
    }
    throw error;
  }
}

// src/lib/package-manager.ts
async function getPackageManagerCommand(packageManager, command, script) {
  const commands = {
    npm: {
      install: ["npm", "install"],
      run: ["npm", "run", script || ""]
    },
    pnpm: {
      install: ["pnpm", "install"],
      run: ["pnpm", "run", script || ""]
    },
    bun: {
      install: ["bun", "install"],
      run: ["bun", "run", script || ""]
    }
  };
  return commands[packageManager][command];
}

// src/lib/validation.ts
import fs2 from "fs-extra";

// src/lib/error-handler.ts
import pc2 from "picocolors";
function handleError(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(pc2.red("\u2717 Error:"), message);
  if (error instanceof Error && error.stack && process.env.DEBUG) {
    console.error(pc2.gray("\nStack trace:"));
    console.error(error.stack);
  }
  console.error(pc2.yellow("\nFor help, visit: https://github.com/your-repo/issues"));
}
var CLIError = class extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "CLIError";
  }
};

// src/lib/validation.ts
function isInteractive() {
  return process.stdout.isTTY && process.stdin.isTTY;
}
async function validateProjectDirectory(config) {
  if (await fs2.pathExists(config.projectDir)) {
    const contents = await fs2.readdir(config.projectDir);
    if (contents.length > 0) {
      throw new CLIError(
        `Directory "${config.projectName}" already exists and is not empty. Please choose a different name or remove the directory.`
      );
    }
  }
}

// src/prompts/git.ts
import * as p from "@clack/prompts";
async function getGitChoice() {
  const git = await p.confirm({
    message: "Initialize a git repository?",
    initialValue: true
  });
  if (p.isCancel(git)) {
    throw new Error("Operation cancelled");
  }
  return git;
}

// src/prompts/project-name.ts
import * as p2 from "@clack/prompts";

// src/types.ts
import { z } from "zod";
var FRAMEWORKS = ["nextjs"];
var PACKAGE_MANAGERS = ["npm", "pnpm", "bun"];
var FrameworkSchema = z.enum(FRAMEWORKS);
var PackageManagerSchema = z.enum(PACKAGE_MANAGERS);
var ProjectNameSchema = z.string().min(1, "Project name cannot be empty").max(255, "Project name must be less than 255 characters").refine(
  (name) => name === "." || !name.startsWith("."),
  "Project name cannot start with a dot (except for '.')"
).refine((name) => name === "." || !name.startsWith("-"), "Project name cannot start with a dash").refine((name) => {
  const invalidChars = ["<", ">", ":", '"', "|", "?", "*"];
  return !invalidChars.some((char) => name.includes(char));
}, "Project name contains invalid characters").refine((name) => name.toLowerCase() !== "node_modules", "Project name is reserved");
var ProjectConfigSchema = z.object({
  projectName: ProjectNameSchema,
  projectDir: z.string(),
  framework: FrameworkSchema,
  git: z.boolean(),
  install: z.boolean(),
  packageManager: PackageManagerSchema
});

// src/prompts/project-name.ts
async function getProjectName(providedName) {
  if (providedName) {
    const result = ProjectNameSchema.safeParse(providedName);
    if (!result.success) {
      throw new Error(`Invalid project name: ${result.error.issues[0]?.message}`);
    }
    return providedName;
  }
  const name = await p2.text({
    message: "What will your project be called?",
    placeholder: "my-app",
    validate: (value) => {
      const result = ProjectNameSchema.safeParse(value);
      if (!result.success) {
        return result.error.issues[0]?.message || "Invalid project name";
      }
    }
  });
  if (p2.isCancel(name)) {
    throw new Error("Operation cancelled");
  }
  return name;
}

// src/commands/create.ts
async function createCommand(projectName, options = {}) {
  logger.info(pc3.magenta("\u{1F680} Creating a new application"));
  try {
    const config = await gatherConfiguration(projectName, options);
    const validatedConfig = ProjectConfigSchema.parse(config);
    await validateProjectDirectory(validatedConfig);
    await setupProject(validatedConfig);
    logger.success(pc3.green("\u2705 Project created successfully!"));
    await showNextSteps(validatedConfig);
  } catch (error) {
    logger.error("Failed to create project");
    throw error;
  }
}
async function gatherConfiguration(projectName, options = {}) {
  const finalProjectName = options.yes && projectName ? projectName : await getProjectName(projectName);
  const projectDir = path3.resolve(process.cwd(), finalProjectName);
  const framework = "nextjs";
  const packageManager = "npm";
  let install;
  if (options.install === true) {
    install = true;
  } else if (options.install === false) {
    install = false;
  } else {
    install = true;
  }
  let git;
  if (options.git === true) {
    git = true;
  } else if (options.git === false) {
    git = false;
  } else if (options.yes) {
    git = true;
  } else if (isInteractive()) {
    git = await getGitChoice();
  } else {
    throw new Error(
      "Git initialization must be specified with --git or --no-git when not in interactive mode. Use --yes to use default settings."
    );
  }
  const config = {
    projectName: finalProjectName,
    projectDir,
    framework,
    git,
    install,
    packageManager
  };
  return config;
}
async function showNextSteps(config) {
  console.log(`
${pc3.blue("\u{1F4DD} Next steps:")}`);
  console.log(`  cd ${config.projectName}`);
  if (!config.install) {
    const installCommand = await getPackageManagerCommand(config.packageManager, "install");
    console.log(`  ${installCommand.join(" ")}`);
  }
  const runCommand = await getPackageManagerCommand(config.packageManager, "run", "dev");
  console.log(`  ${runCommand.join(" ")}`);
  console.log(`
${pc3.green("\u{1F389} Happy coding!")}`);
}

// src/cli.ts
var program = new Command();
program.name(CLI_NAME).description(CLI_DESCRIPTION).argument("[project-name]", "Name of the project to create").option("-y, --yes", "Skip prompts and use default options", false).option("-g, --git", "Initialize a git repository").option("--no-git", "Skip Git initialization", false).option("-i, --install", "Install dependencies").option("--no-install", "Skip dependency installation", false).action(async (projectName, options) => {
  try {
    await createCommand(projectName, options);
  } catch (error) {
    handleError(error);
    process.exit(1);
  }
});
process.on("unhandledRejection", (error) => {
  handleError(error);
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  handleError(error);
  process.exit(1);
});
program.parse();
