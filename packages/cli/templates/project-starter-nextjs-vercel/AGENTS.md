# Agent Guidelines for simple-ai starter

## Build/Lint/Test Commands

- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build production bundle
- `npm run typecheck` - Type check without emitting files
- `npm run lint` - Run Biome linter and auto-fix (only checks `src/`)
- `npm run db:generate` - Generate migrations (NEVER run automatically, prompt user to run)
- `npm run db:migrate` - Run migrations (NEVER run automatically, prompt user to run)
- No test suite configured yet

## Code Style

- **Formatting**: Biome with tabs (width 2), double quotes, trailing commas, semicolons, 100 line width
- **Files**: kebab-case naming (enforced by linter)
- **Imports**: Use `@/` path alias, organize imports automatically, no unused imports
- **Types**: TypeScript strict mode, use `type` for object shapes, `interface` for extensible types
- **Naming**: camelCase variables/functions, PascalCase components/types, SCREAMING_SNAKE_CASE constants
- **Error Handling**: Try-catch in async functions, return appropriate HTTP status codes (404, 500)

## Client

- **React**: Use "use client" directive when needed, functional components, hooks at top level
- **RPC Client**: `apiClient` from `hono/client` typed with `AppType`, enables type-safe API calls
- **React Query**: Custom hooks in `src/hooks/query/` use `apiClient` for type-safe mutations/queries
- **State Management**: Use React Query for server state whenever possible, create custom hooks in `src/hooks/query/`
- **UI Components**: Use shadcn/ui components with Tailwind, keep default shadcn variables/styles unless instructed otherwise. If a component is not installed, run `npx shadcn@latest add <component-name>`

## Server

- **Hono API**: Routes in `src/hono/routes/{public,protected}`, exported as `AppType` for RPC client
- **API Routes**: Hono router, separate public/protected routes, type-safe context with `HonoContextWithAuth`
- **Validation**: Zod schemas for API validation with `zValidator`, infer types with `z.infer<typeof schema>`
- **Database**: Drizzle schemas in `src/db/schema/`, services in `src/db/services/` with CRUD operations
- **Database**: Drizzle ORM, use prepared statements, always filter by userId for multi-tenant data
- **Auth**: better-auth, protected routes use `honoAuthMiddleware` and `HonoContextWithAuth` type
- **Environment**: Type-safe env vars with `@t3-oss/env-nextjs` in `src/env.ts`, import from `@/env`

## AI

- **SDK**: Use Vercel AI SDK (`ai` package) for AI features
