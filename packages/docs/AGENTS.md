# AGENTS.md - Coding Guidelines

## Build & Test Commands

- **Dev server:** `npm run dev` (never run the dev server command, its just for reference)
- **Lint & format:** `npm run lint` (Biome: fixes in-place)
- **Type check:** `npm run typecheck` (tsc --noEmit) - use this instead of npm run build
- **Registry rebuild:** `npm run registry:build` - run after modifying registry files
- **Build:** `npm run build` (for final production builds only - left for user)

Note: When changes are made to registry files in `src/registry/`, run `npm run registry:build` before testing.

## Code Style Guidelines

**Formatting (Biome):**
- Indent: tabs (width 4)
- Line width: 80 characters
- Quotes: double quotes
- Semicolons: always
- Arrow functions: parentheses always
- Trailing commas: all

**Naming Conventions:**
- Files: kebab-case (enforced by Biome)
- React components: PascalCase
- Constants/enums: UPPER_SNAKE_CASE
- Functions/variables: camelCase

**Imports:**
- Use ES modules syntax (`import`/`export`)
- Path aliases: `@/*` maps to `./src/*`
- Remove unused imports (enforced by Biome)

**TypeScript:**
- Strict mode enabled
- Always add explicit return types to functions
- Use `const` by default, `let` when needed
- No unused variables/parameters (enforced)

**Error Handling:**
- Use proper Error objects, never bare throws
- Handle promise rejections and async/await errors
- Use React Error Boundary for React error handling
- Log errors appropriately (project uses error-boundary)

**React-Specific:**
- Hooks at top level (enforced by Biome)
- Use `next/image` for images, `next/link` for navigation
- Avoid dangerously setting HTML (security rule disabled intentionally)
- File-based routing via `src/app/` directory structure
