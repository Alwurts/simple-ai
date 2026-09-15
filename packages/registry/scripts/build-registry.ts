import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import type { RegistryItemDef } from "../src/types";

/** `--check` exits non-zero when `registry.json`, `src/generated.ts`, or hosted `/r` is stale. */

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = join(HERE, "..");
const REPO_ROOT = join(PKG_ROOT, "..", "..");
const ITEMS_DIR = join(PKG_ROOT, "registry");

const REPO_PREFIX = "packages/registry/registry";
const HOMEPAGE = "https://www.simple-ai.dev";

const REGISTRY_JSON = join(REPO_ROOT, "registry.json");
const GENERATED_TS = join(PKG_ROOT, "src", "generated.ts");
const HOSTED_DIR = join(REPO_ROOT, "apps/docs/public/r");
const SHADCN_BIN = join(PKG_ROOT, "node_modules", ".bin", "shadcn");

interface LoadedDef {
  name: string;
  fileRoot: string;
  filePrefix: string;
  preview: string;
  def: RegistryItemDef;
}

function previewExists(preview: string): boolean {
  return (
    existsSync(join(ITEMS_DIR, `${preview}.tsx`)) ||
    existsSync(join(ITEMS_DIR, `${preview}.ts`))
  );
}

function assertFiles(def: LoadedDef): void {
  if (def.def.item.name !== def.name) {
    throw new Error(
      `${def.filePrefix}: item.name "${def.def.item.name}" must match "${def.name}"`
    );
  }

  for (const file of def.def.item.files ?? []) {
    const abs = join(def.fileRoot, file.path);
    if (!existsSync(abs)) {
      throw new Error(
        `${def.filePrefix}: file not found on disk: ${file.path}`
      );
    }
  }

  if (!previewExists(def.preview)) {
    throw new Error(
      `${def.name}: preview not found: ${def.preview}.tsx (or .ts)`
    );
  }
}

async function loadUiDefs(): Promise<LoadedDef[]> {
  const fileRoot = join(ITEMS_DIR, "ui");
  const href = pathToFileURL(join(fileRoot, "_registry.ts")).href;
  const mod = (await import(href)) as { ui: RegistryItemDef[] };
  const defs: LoadedDef[] = [];

  for (const def of mod.ui) {
    const loaded: LoadedDef = {
      name: def.item.name,
      fileRoot,
      filePrefix: `${REPO_PREFIX}/ui`,
      preview: def.preview,
      def,
    };
    if (def.item.type !== "registry:ui") {
      throw new Error(
        `ui/${def.item.name}: type "${def.item.type}" must be "registry:ui"`
      );
    }
    assertFiles(loaded);
    defs.push(loaded);
  }

  return defs;
}

async function loadBlockDefs(): Promise<LoadedDef[]> {
  const kindDir = join(ITEMS_DIR, "blocks");
  if (!existsSync(kindDir)) {
    return [];
  }

  const names = readdirSync(kindDir, { withFileTypes: true })
    .filter(
      (d) => d.isDirectory() && existsSync(join(kindDir, d.name, "item.ts"))
    )
    .map((d) => d.name)
    .sort();

  const defs: LoadedDef[] = [];
  for (const name of names) {
    const relPath = `blocks/${name}`;
    const itemDir = join(ITEMS_DIR, relPath);
    const href = pathToFileURL(join(itemDir, "item.ts")).href;
    const mod = (await import(href)) as { default: RegistryItemDef };
    const def = mod.default;

    if (def.item.type !== "registry:block") {
      throw new Error(
        `${relPath}: type "${def.item.type}" must be "registry:block"`
      );
    }

    const loaded: LoadedDef = {
      name,
      fileRoot: itemDir,
      filePrefix: `${REPO_PREFIX}/${relPath}`,
      preview: `${relPath}/${def.preview}`,
      def,
    };
    assertFiles(loaded);
    defs.push(loaded);
  }
  return defs;
}

async function loadDefs(): Promise<LoadedDef[]> {
  const defs = [...(await loadUiDefs()), ...(await loadBlockDefs())];
  const seen = new Set<string>();
  for (const def of defs) {
    if (seen.has(def.name)) {
      throw new Error(`duplicate registry item name: ${def.name}`);
    }
    seen.add(def.name);
  }
  return defs.sort((a, b) => a.name.localeCompare(b.name));
}

function catalogItems(defs: LoadedDef[]) {
  return defs.map(({ name, filePrefix, def }) => {
    const item = {
      ...def.item,
      files: (def.item.files ?? []).map((f) => ({
        ...f,
        path: `${filePrefix}/${f.path}`,
      })),
    };
    const parsed = registryItemSchema.safeParse(item);
    if (!parsed.success) {
      throw new Error(`${name}: ${parsed.error.message}`);
    }
    return item;
  });
}

function buildRegistryJson(defs: LoadedDef[]): string {
  const items = catalogItems(defs);
  const manifest = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "simple-ai",
    homepage: HOMEPAGE,
    items,
  };
  const parsed = registrySchema.safeParse(manifest);
  if (!parsed.success) {
    throw new Error(`registry.json: ${parsed.error.message}`);
  }
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function buildGeneratedTs(defs: LoadedDef[]): string {
  const lines: string[] = [
    "// AUTO-GENERATED by `pnpm --filter @workspace/registry generate`. Do not edit by hand.",
    'import { lazy } from "react";',
    'import type { RegistryEntry } from "./types";',
    "",
    "export const REGISTRY: Record<string, RegistryEntry> = {",
  ];
  for (const { def, preview } of defs) {
    const { item } = def;
    const importPath = `../registry/${preview}`;
    lines.push(`  ${JSON.stringify(item.name)}: {`);
    lines.push(`    name: ${JSON.stringify(item.name)},`);
    lines.push(`    type: ${JSON.stringify(item.type)},`);
    if (item.title !== undefined) {
      lines.push(`    title: ${JSON.stringify(item.title)},`);
    }
    if (item.description !== undefined) {
      lines.push(`    description: ${JSON.stringify(item.description)},`);
    }
    if (item.categories !== undefined) {
      lines.push(`    categories: ${JSON.stringify(item.categories)},`);
    }
    lines.push(`    meta: ${JSON.stringify(item.meta ?? {})},`);
    lines.push(
      `    component: lazy(() => import(${JSON.stringify(importPath)})),`
    );
    lines.push("  },");
  }
  lines.push("};", "");
  return lines.join("\n");
}

function format(path: string, content: string): string {
  return execFileSync(
    "pnpm",
    ["exec", "biome", "check", "--write", `--stdin-file-path=${path}`],
    { input: content, encoding: "utf8", cwd: REPO_ROOT }
  );
}

function buildHosted(outDir: string): void {
  execFileSync(SHADCN_BIN, ["build", REGISTRY_JSON, "--output", outDir], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
}

function jsonNames(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort();
}

function hostedMismatches(freshDir: string, committedDir: string): string[] {
  const fresh = jsonNames(freshDir);
  const committed = jsonNames(committedDir);
  const stale: string[] = [];
  for (const name of fresh) {
    const committedPath = join(committedDir, name);
    if (!existsSync(committedPath)) {
      stale.push(`missing: ${join(committedDir, name)}`);
      continue;
    }
    if (
      readFileSync(join(freshDir, name), "utf8") !==
      readFileSync(committedPath, "utf8")
    ) {
      stale.push(committedPath);
    }
  }
  for (const name of committed) {
    if (!fresh.includes(name)) {
      stale.push(`extra: ${join(committedDir, name)}`);
    }
  }
  return stale;
}

function assertHostedUpToDate(): void {
  const tmp = mkdtempSync(join(tmpdir(), "simple-ai-r-"));
  try {
    buildHosted(tmp);
    const stale = hostedMismatches(tmp, HOSTED_DIR);
    if (stale.length > 0) {
      for (const path of stale) {
        process.stderr.write(`stale: ${path}\n`);
      }
      process.stderr.write(
        "Registry artifacts are out of date. Run `pnpm --filter @workspace/registry generate`.\n"
      );
      process.exit(1);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  const check = process.argv.includes("--check");
  const defs = await loadDefs();
  const artifacts: Array<{ path: string; content: string }> = [
    {
      path: REGISTRY_JSON,
      content: format(REGISTRY_JSON, buildRegistryJson(defs)),
    },
    {
      path: GENERATED_TS,
      content: format(GENERATED_TS, buildGeneratedTs(defs)),
    },
  ];

  if (check) {
    const stale = artifacts.filter((a) => {
      const onDisk = existsSync(a.path) ? readFileSync(a.path, "utf8") : "";
      return onDisk !== a.content;
    });
    if (stale.length > 0) {
      for (const a of stale) {
        process.stderr.write(`stale: ${a.path}\n`);
      }
      process.stderr.write(
        "Registry artifacts are out of date. Run `pnpm --filter @workspace/registry generate`.\n"
      );
      process.exit(1);
    }
    assertHostedUpToDate();
    process.stdout.write(`Registry up to date (${defs.length} items).\n`);
    return;
  }

  for (const a of artifacts) {
    writeFileSync(a.path, a.content);
  }

  buildHosted(HOSTED_DIR);

  process.stdout.write(
    `Wrote registry.json + src/generated.ts + hosted /r (${defs.length} items).\n`
  );
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
