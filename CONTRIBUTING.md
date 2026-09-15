# Contributing

simple-ai is a shadcn registry of curated agent examples. Copy source into your app with the shadcn CLI.

## Setup

```bash
pnpm install
pnpm --filter @workspace/registry generate
pnpm --filter docs dev
```

Docs: http://localhost:4567

Node 22+. pnpm 10.

## Layout

- `apps/docs` — site and hosted registry (`/r/{name}.json`)
- `packages/registry` — item source (`registry/ui`, `registry/examples`, `registry/blocks`)
- `packages/ui` — shadcn primitives used by the docs app
- `registry.json` — GitHub registry manifest (generated)

## Common commands

```bash
pnpm --filter @workspace/registry generate
pnpm --filter @workspace/registry generate:check
pnpm --filter docs dev
pnpm typecheck
pnpm lint:check
```

After changing a registry item, run `generate` so `registry.json` and
`apps/docs/public/r` stay in sync. `generate:check` covers both plus
`packages/registry/src/generated.ts`.

## Pull requests

1. Branch from `main` (or the current working branch).
2. Make the change. If you edited registry source, run generate.
3. `pnpm typecheck` and `pnpm lint:check`.
4. Open a PR against `main`.

`create-simple-ai` is deprecated. Do not add a project template here. Use `shadcn init`, then `npx shadcn@latest add @simple-ai/chat-page`.
