# Monorepo Migration: create-simple-ai → simple-ai

## ⚠️ IMPORTANT: Execution Notes for AI Assistant

**This plan is designed for AI-assisted execution. Follow these rules:**

1. **NO GIT COMMITS** - Never run `git commit`, `git push`, or `git branch` commands


**ONLY git commit/push/branch operations must be done manually by the user.**

## Problem

Currently we have two separate repos:
- `create-simple-ai`: CLI tool (published to npm)
- `simple-ai`: Documentation site (private)

**Issues:**
- CLI and docs can't share tooling configs
- No unified development workflow
- Hard to test CLI with latest components
- Separate dependency management
- No atomic commits across both

## Solution

Merge `create-simple-ai` into `simple-ai` as a monorepo with npm workspaces:
- `packages/cli/` - create-simple-ai CLI (published) + templates
- `packages/docs/` - Documentation site (private)
- Unified tooling, shared dependencies, atomic commits

## Current State Analysis

### create-simple-ai
```
├── .changeset/                    # Changesets for versioning
├── packages/
│   ├── cli/                       # create-simple-ai@0.2.4 (published)
│   │   ├── src/                   # CLI source
│   │   ├── test/                  # Vitest tests
│   │   ├── dist/                  # Built CLI + bundled templates
│   │   ├── tsup.config.ts         # Bundles templates via publicDir
│   │   └── package.json
│   └── templates/
│       └── project-starter-nextjs-vercel/
├── scripts/pre-release-check.ts   # Release validation
├── biome.json                     # indent: 2, lineWidth: 100
└── package.json                   # Workspace root
```

### simple-ai
```
├── src/                           # Next.js docs site
├── public/
├── biome.json                     # indent: 4, lineWidth: 80
├── package.json                   # private: true
└── tsconfig.json
```

## Final Structure

```
simple-ai/
├── .changeset/                    # Changesets config
├── packages/
│   ├── cli/                       # create-simple-ai (published) + templates
│   │   ├── src/
│   │   ├── templates/             # Excluded from Biome formatting
│   │   │   └── project-starter-nextjs-vercel/
│   │   ├── test/
│   │   ├── dist/                  # Built CLI + templates
│   │   ├── package.json           # includes tsup, vitest
│   │   ├── tsup.config.ts
│   │   └── vitest.config.ts
│   └── docs/                      # Documentation site (private)
│       ├── src/
│       ├── public/
│       ├── package.json           # name: "@simple-ai/docs"
│       └── next.config.mjs
├── scripts/pre-release-check.ts
├── biome.json                     # Unified: tabs, lineWidth 100, arrowParentheses asNeeded
├── tsconfig.base.json             # Base TS config
├── package.json                   # Root workspace (no build tools)
└── README.md
```

## Command Structure

Root package.json scripts:
```json
{
  "scripts": {
    "dev": "npm run dev --workspace=@simple-ai/docs",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "biome check --write .",
    "typecheck": "npm run typecheck --workspaces --if-present",

    "cli:dev": "npm run dev --workspace=create-simple-ai",
    "cli:build": "npm run build --workspace=create-simple-ai",
    "cli:test": "npm run test --workspace=create-simple-ai",
    "cli:test:run": "npm run test:run --workspace=create-simple-ai",

    "docs:dev": "npm run dev --workspace=@simple-ai/docs",
    "docs:build": "npm run build --workspace=@simple-ai/docs",

    "changeset": "changeset",
    "changeset:version": "changeset version",
    "release": "npm run cli:build && changeset publish",
    "release:check": "tsx scripts/pre-release-check.ts"
  }
}
```

## Critical: Template Bundling

**How it works:** tsup's `publicDir` copies templates to dist/

**packages/cli/tsup.config.ts:**
```typescript
export default defineConfig({
  entry: ["src/cli.ts"],
  publicDir: "./templates", // CRITICAL
});
```

**Result:**
```
packages/cli/dist/
├── cli.js                              # Built CLI
└── project-starter-nextjs-vercel/      # Complete template
```

**CLI finds templates:**
```typescript
// packages/cli/src/lib/config.ts
export const TEMPLATES_DIR = __dirname.endsWith("/dist")
  ? __dirname  // Production: templates bundled into dist/
  : path.resolve(__dirname, "../templates"); // Dev: packages/cli/templates/
```

**Migration impact:** Simplified relative path from `../../../../packages/templates` to `../templates` ✅

## Key Improvements in This Plan

### 1. **Robust File Copying**
- Using `cp -r source/. destination/` ensures all hidden files are copied
- Using `find` for selective file moves avoids missing files
- Verification commands after each copy operation

### 2. **Better Biome Configuration**
- `arrowParentheses: "asNeeded"` - cleaner than "always"
- `useUniqueElementIds: "off"` - needed for Next.js
- Templates explicitly excluded from formatting to preserve user-facing code style
- Removed `indentWidth` (not meaningful for tabs)

### 3. **Proper Dependency Management**
- Build tools (`tsup`, `vitest`) in CLI package where they belong
- Root only has monorepo management tools (`biome`, `changesets`, `typescript`, `tsx`)
- Avoids dependency confusion and keeps root minimal

### 4. **Separate Formatting Commits**
- Format CLI, docs, and root in separate commits
- Makes git history cleaner and easier to review
- Allows bisecting issues without formatting noise

### 5. **End-to-End Smoke Testing**
- Not just creating projects, but building them too
- Ensures templates work correctly after migration
- Catches bundling issues early

## Migration Phases

**Strategy Notes:**
- Using programmatic file operations to avoid missing files
- Git-tracked files ensure recovery if issues arise
- Separate formatting commits for cleaner git history
- Smoke test created projects to verify end-to-end functionality
- Build tools (tsup, vitest) live in CLI package, not root

### Phase 1 Create Branch (5 min)

**⚠️ USER ACTION REQUIRED - Git operations must be done manually:**

```bash
cd /Users/alwurts/Development/simple/simple-ai
git checkout -b monorepo-migration
```

### Phase 3: Create Structure (15 min)

```bash
cd /Users/alwurts/Development/simple/simple-ai

# Create packages
mkdir -p packages/cli packages/docs

# Move docs content - use find to avoid missing files
# Move all root files except git, node_modules, and package files
find . -maxdepth 1 -type f \
  ! -name 'package*.json' \
  ! -name '.gitignore' \
  ! -name '.*' \
  -exec mv {} packages/docs/ \;

# Move directories
for dir in src public project-docs; do
  [ -d "$dir" ] && mv "$dir" packages/docs/
done

# Keep old configs for reference
[ -f biome.json ] && cp biome.json packages/docs/biome.json.old
[ -f tsconfig.json ] && cp tsconfig.json packages/docs/tsconfig.json.old

# List what we moved for verification
echo "=== Files moved to packages/docs/ ==="
ls -la packages/docs/
```

### Phase 4: Copy CLI Files (20 min)

```bash
cd /Users/alwurts/Development/simple/simple-ai

# Copy CLI (entire directory with all contents)
cp -r /Users/alwurts/Development/simple/create-simple-ai/packages/cli/. \
      packages/cli/

# Copy templates into CLI package
mkdir -p packages/cli/templates
cp -r /Users/alwurts/Development/simple/create-simple-ai/packages/templates/. \
      packages/cli/templates/

# Copy changesets
cp -r /Users/alwurts/Development/simple/create-simple-ai/.changeset .

# Copy scripts
mkdir -p scripts
cp -r /Users/alwurts/Development/simple/create-simple-ai/scripts/. scripts/

# Copy root documentation files
for file in RELEASING.md TESTING.md CONTRIBUTING.md; do
  [ -f "/Users/alwurts/Development/simple/create-simple-ai/$file" ] && \
    cp "/Users/alwurts/Development/simple/create-simple-ai/$file" .
done

# Verify what we copied
echo "=== CLI files ==="
ls -la packages/cli/
echo "=== Templates ==="
ls -la packages/cli/templates/
echo "=== Scripts ==="
ls -la scripts/
```

### Phase 5: Root Configurations (30 min)

Create these files in `/Users/alwurts/Development/simple/simple-ai/`:

**package.json** (root workspace):
```json
{
  "name": "simple-ai-monorepo",
  "version": "0.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "npm run dev --workspace=@simple-ai/docs",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "biome check --write .",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "cli:dev": "npm run dev --workspace=create-simple-ai",
    "cli:build": "npm run build --workspace=create-simple-ai",
    "cli:test": "npm run test --workspace=create-simple-ai",
    "cli:test:run": "npm run test:run --workspace=create-simple-ai",
    "docs:dev": "npm run dev --workspace=@simple-ai/docs",
    "docs:build": "npm run build --workspace=@simple-ai/docs",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "release": "npm run cli:build && changeset publish",
    "release:check": "tsx scripts/pre-release-check.ts"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.3.5",
    "@changesets/cli": "^2.29.7",
    "typescript": "^5.9.3",
    "tsx": "^4.20.6"
  },
  "engines": { "node": ">=18.0.0" }
}
```

**biome.json** (unified formatting):
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.5/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": {
    "ignoreUnknown": true,
    "ignore": ["node_modules", "dist", "build", ".next", "packages/cli/templates"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedFunctionParameters": "error",
        "noUnusedImports": "error",
        "noUnusedVariables": "error",
        "useHookAtTopLevel": "error",
        "useUniqueElementIds": "off"
      },
      "complexity": { "noBannedTypes": "off" },
      "security": { "noDangerouslySetInnerHtml": "off" },
      "style": {
        "useBlockStatements": "error",
        "useFilenamingConvention": {
          "level": "error",
          "options": { "strictCase": true, "filenameCases": ["kebab-case"] }
        }
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always",
      "arrowParentheses": "asNeeded"
    }
  },
  "css": { "parser": { "tailwindDirectives": true } }
}
```

**tsconfig.base.json** (base TypeScript):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "exclude": ["node_modules", "dist", "build", ".next"]
}
```

**tsconfig.json** (root):
```json
{
  "extends": "./tsconfig.base.json",
  "files": []
}
```

**.gitignore** (updated):
```gitignore
# Dependencies
node_modules
npm-debug.log*

# Build outputs
dist
build
.next
out
*.tsbuildinfo

# Environment
.env
.env*.local

# OS
.DS_Store
*.pem
Thumbs.db

# IDE
.vscode
.idea
*.swp
*.swo
*~

# Testing
coverage
.vitest

# Misc
*.log
.source
```

**README.md** (new root):
```markdown
# Simple AI Monorepo

## Packages
- **[create-simple-ai](./packages/cli/)** - CLI for scaffolding Simple AI projects
- **[@simple-ai/docs](./packages/docs/)** - Documentation and component registry site

## Development
```bash
npm run dev          # Start docs dev server
npm run cli:dev      # Watch CLI changes
npm run build        # Build everything
npm run test         # Run all tests
```

## Release
```bash
npm run changeset    # Add changeset
npm run release      # Publish CLI
```

See [RELEASING.md](./RELEASING.md) for details.
```

### Phase 6: Update Package Configs (30 min)

**packages/cli/package.json** updates:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/Alwurts/simple-ai.git",
    "directory": "packages/cli"
  }
}
```

**packages/cli/tsconfig.json**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "target": "ES2022" },
  "include": ["src/**/*", "test/**/*"],
  "exclude": ["dist"]
}
```

**packages/docs/package.json** updates:
```json
{
  "name": "@simple-ai/docs",
  "private": true
}
```

**packages/docs/tsconfig.json**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "react": ["./node_modules/@types/react"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "src/scripts/**/*.mts",
    "next.config.mjs"
  ]
}
```

**.changeset/config.json**:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@simple-ai/docs"]
}
```

### Phase 6.5: Update CLI Template Paths (10 min)

Update template paths in CLI configuration for new structure:

**packages/cli/tsup.config.ts:**
```typescript
// Line 17: Update publicDir path
publicDir: "./templates",
```

**packages/cli/src/lib/config.ts:**
```typescript
// Lines 7-9: Update TEMPLATES_DIR for new structure
export const TEMPLATES_DIR = __dirname.endsWith("/dist")
  ? __dirname  // Production: templates bundled into dist/
  : path.resolve(__dirname, "../templates"); // Dev: packages/cli/templates/
```

**Verification:**
```bash
cd /Users/alwurts/Development/simple/simple-ai

# Check paths are correct
grep -n "publicDir" packages/cli/tsup.config.ts
grep -n "TEMPLATES_DIR" packages/cli/src/lib/config.ts
```

### Phase 7: Dependencies (30 min)

```bash
cd /Users/alwurts/Development/simple/simple-ai

# Clean everything
rm -rf node_modules package-lock.json
rm -rf packages/cli/node_modules
rm -rf packages/docs/node_modules

# Install
npm install
```

### Phase 8: Build Verification (30 min)

**CRITICAL: Test template bundling**

```bash
cd /Users/alwurts/Development/simple/simple-ai

# Build CLI
npm run cli:build

# Verify templates bundled
ls -la packages/cli/dist/
# Should show: cli.js, project-starter-nextjs-vercel/

# Test CLI creates project
cd /tmp
node /Users/alwurts/Development/simple/simple-ai/packages/cli/dist/cli.js test-project --yes --no-install
ls -la test-project/
cat test-project/package.json

# SMOKE TEST: Verify created project actually works
cd test-project
npm install
npm run build  # Should build successfully
echo "✅ Created project builds successfully"

# Cleanup
cd /tmp
rm -rf test-project

# Build docs
cd /Users/alwurts/Development/simple/simple-ai
npm run docs:build

# Test dev server
npm run dev
# Verify http://localhost:4567 works
# Press Ctrl+C to stop
```

### Phase 9: Testing (30 min)

```bash
cd /Users/alwurts/Development/simple/simple-ai

npm run test           # All tests
npm run cli:test:run   # CLI tests
npm run typecheck      # Type checking
npm run lint           # Formatting
```

### Phase 10: Code Reformatting (30 min)

**Format code, git commits done manually by user**

```bash
cd /Users/alwurts/Development/simple/simple-ai

# Format CLI package only
npm run lint -- packages/cli

# Format docs package only
npm run lint -- packages/docs

# Format root files
npm run lint -- "*.{ts,js,json}"
```

**⚠️ USER ACTION - After formatting, create separate commits:**
```bash
git add packages/cli
git commit -m "chore: apply biome formatting to CLI package"

git add packages/docs
git commit -m "chore: apply biome formatting to docs package"

git add .
git commit -m "chore: apply biome formatting to root configs"
```

### Phase 11: Documentation Updates (45 min)

Update these files:
- **RELEASING.md** - Update paths to `packages/cli/`
- **CONTRIBUTING.md** - Add monorepo explanation
- **packages/cli/README.md** - Create if missing
- **packages/docs/README.md** - Create if missing

### Phase 12: Commit Migration (15 min)

**⚠️ USER ACTION - Git commit and push must be done manually:**

```bash
cd /Users/alwurts/Development/simple/simple-ai

git add .
git commit -m "feat: migrate create-simple-ai into monorepo

- Create packages/ structure with cli (including templates), docs
- Move simple-ai content to packages/docs/
- Copy create-simple-ai CLI and templates to packages/cli/
- Set up npm workspaces with unified tooling
- Standardize on Biome (tabs, lineWidth 100, arrowParentheses asNeeded)
- Configure changesets to ignore docs package
- Add root commands with clear cli:/docs: prefixes

Breaking changes: None (CLI published as separate package)"

git push -u origin monorepo-migration
```

## Configuration Changes Summary

**5 files updated for template path changes:**
1. ✅ `packages/cli/tsup.config.ts` - `publicDir: "./templates"`
2. ✅ `packages/cli/src/lib/config.ts` - `TEMPLATES_DIR` path updated
3. ✅ Root `package.json` - Removed `packages/templates/*` from workspaces, moved build tools to CLI
4. ✅ `.changeset/config.json` - Removed template from ignore list
5. ✅ Root `biome.json` - Templates excluded from formatting, use `arrowParentheses: "asNeeded"`

**Key Configuration Decisions:**
- **Arrow Parentheses**: Using `"asNeeded"` for cleaner code (matches CLI convention)
- **Template Formatting**: Templates excluded from Biome to preserve user-facing formatting
- **Build Tools**: `tsup` and `vitest` in CLI package devDependencies, not root
- **Biome Rules**: Added `useUniqueElementIds: "off"` for Next.js compatibility

## Testing Checklist

### Build & Development
- [ ] `npm install` works
- [ ] `npm run build` builds both packages
- [ ] `npm run cli:build` produces `packages/cli/dist/cli.js`
- [ ] `packages/cli/dist/` contains template directory
- [ ] `npm run docs:build` produces `.next/`
- [ ] `npm run dev` starts docs on port 4567
- [ ] `npm run cli:dev` watches CLI changes

### CLI Functionality
- [ ] CLI runs: `node packages/cli/dist/cli.js --help`
- [ ] CLI creates project: `node packages/cli/dist/cli.js test-app --yes --no-install`
- [ ] Created project has correct structure
- [ ] Template files are complete

### Testing
- [ ] `npm run test` runs all tests
- [ ] `npm run cli:test:run` passes CLI tests
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` formats code

### Release Simulation
- [ ] `npm run changeset` offers only `create-simple-ai`
- [ ] `npm run changeset:version` bumps CLI version
- [ ] `npm run release:check` passes
- [ ] Dry run publish works

### Configuration
- [ ] Biome formats consistently
- [ ] No TypeScript errors
- [ ] Workspace dependencies resolve
- [ ] No duplicate dependencies

## Release Process (Post-Migration)

**Same as before:**

```bash
# Development
npm run changeset    # Add changeset

# Release
npm run changeset:version
git add . && git commit -m "chore(release): version packages"
npm run release
git push origin main --tags
```

**Git tags:** `create-simple-ai@X.Y.Z` (unchanged)

## Rollback Plan

**Before publishing:**
```bash
git checkout main
git branch -D monorepo-migration
```

**After publishing:**
- Deprecate bad version on npm
- Publish fix from create-simple-ai-backup repo

## Post-Migration Tasks

- [ ] Test first release
- [ ] Verify `npx create-simple-ai@latest` works
- [ ] Monitor npm downloads
- [ ] Consider versioning docs later (remove from `.changeset/config.json` ignore)