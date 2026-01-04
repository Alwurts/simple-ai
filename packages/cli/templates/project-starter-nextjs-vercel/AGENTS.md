# Agent Guidelines for simple-ai starter

## Project Patterns & Best Practices

This project follows a strict layered architecture to ensure consistency, type safety, and reusability across the UI and AI layers.

### 1. Project Organization

- `src/db/schema/`: Database table definitions (Drizzle).
- `src/db/services/`: Centralized business logic (The "Brain").
- `src/hono/routes/`: API endpoint definitions.
- `src/types/`: Unified Zod schemas used for validation, types, and AI tools.
- `src/hooks/query/`: Custom React Query hooks for client state.
- `src/app/`: Next.js App Router (Pages and Layouts).
- `src/lib/ai/tools/`: AI tool definitions.

---

### 2. Persistence Layer (Drizzle)

- **Timestamps**: Always use `mode: "string"` for timestamps to ensure consistent ISO strings.
  - `timestamp("created_at", { mode: "string" }).defaultNow().notNull()`
- **Multi-tenancy**: Every user-owned table MUST have a `userId` field and all queries MUST filter by this `userId`.
- **Relations**: Define explicit relations using the Drizzle `relations` API to enable type-safe relational queries.
- **Migrations**: Use `npm run db:generate` to create migrations and `npm run db:migrate` to apply them. NEVER run these automatically.

### 3. Service Layer (The "Brain")

- **Location**: `src/db/services/`
- **Purpose**: All data mutations and complex queries must live here.
- **Shared Logic**: Services are the single source of truth and are shared between Hono API routes and AI Tools.
- **Pattern**: Export granular, async functions. Always require `userId` as an argument for security.

### 4. Unified Type System (Zod)

- **Location**: `src/types/`
- **Pattern**: Define Zod schemas for every entity (e.g., `productSchema`, `createProductSchema`).
- **Reuse**:
  - **API**: Use `zValidator("json", schema)` in Hono.
  - **Types**: Infer TypeScript types using `z.infer<typeof schema>`.
  - **AI**: Use the same schemas for AI tool `inputSchema` and `outputSchema`.

### 5. API Layer (Hono)

- **Structure**: Group routes by module (e.g., `src/hono/routes/protected/inventory/products.ts`).
- **Context**: Use `HonoContextWithAuth` for protected routes to access the authenticated user via `c.get("user")`.
- **RPC**: Export the router type as `AppType` to enable the type-safe `apiClient` on the frontend.

### 6. Client State (React Query)

- **Location**: `src/hooks/query/`
- **Pattern**: Wrap all `apiClient` calls in custom hooks.
- **Query Keys**: Centralize query key generation functions (e.g., `getProductsKey()`) within the hook file.
- **Invalidation**: Always implement `onSuccess` in mutations to invalidate relevant query keys and keep the UI in sync.

### 7. Frontend & UI Patterns

- **Layouts**: Use the standard layout components for consistency:
  - `AppLayoutPage`: Main page container.
  - `AppLayoutHeader`: Standard header with breadcrumb support.
  - `AppLayoutHeaderActions`: Container for header buttons.
- **Breadcrumbs**: Every page should use `AppBreadcrumbs` for navigation consistency.
- **Components**: Use `shadcn/ui` components. If a component is missing, add it via `npx shadcn@latest add <name>`.
- **Client/Server**: Default to Server Components; use `"use client"` only for interactive elements or when using hooks.

### 8. AI Integration

- **Tools**: Located in `src/lib/ai/tools/(registry)/`.
- **Implementation**: Tools should be thin wrappers around the Service Layer.
- **Skills**: Use the `load-skill` tool to dynamically provide the agent with new capabilities and instructions defined in `SKILL.md` files.

---

## Build/Lint/Test Commands

- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build production bundle
- `npm run typecheck` - Type check without emitting files
- `npm run lint` - Run Biome linter and auto-fix
- `npm run db:seed` - Seed database with test data

## Code Style

- **Formatting**: Biome (tabs, width 2, double quotes, semicolons).
- **Naming**: `kebab-case` files, `camelCase` variables/functions, `PascalCase` components/types.
- **Error Handling**: Use try-catch in Hono routes and throw descriptive errors in services.
