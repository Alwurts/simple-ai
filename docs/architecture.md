# Architecture

simple-ai is a **shadcn registry** plus a docs site that hosts it. Copy an
example into your app. Change the source.

The public site is not the source of item code. Item source lives in
`packages/registry`. The docs app shows it and serves `/r/{name}.json`.

## Layout

| Path | Role |
| --- | --- |
| `packages/registry/registry/ui/` | UI items (one file each; catalog in `_registry.ts`) |
| `packages/registry/registry/examples/` | Docs previews (not installed) |
| `packages/registry/registry/blocks/` | Blocks (`chat-page` folder) |
| `packages/registry/scripts/build-registry.ts` | Generate both registries |
| `registry.json` | GitHub registry (`npx shadcn add Alwurts/simple-ai/<name>`) |
| `apps/docs/public/r/` | Hosted registry JSON |
| `apps/docs` | TanStack Start + Fumadocs site (Cloudflare Worker) |
| `packages/ui` | shadcn primitives used by the docs app |

## Catalog

- Blocks: `chat-page` (2D, gallery mocked) and `chat-card` (in-world XR, mocked).
- Documented UI: whatever `apps/docs/content/docs/components/meta.json` lists.
  2D: `chat-input`, `tool`, `worked`. In-world: `world-card`, `xr-button`,
  `xr-chat-input`, `xr-tool`, `xr-worked`, `xr-reasoning`, `xr-markdown`.
- `shell` and `reasoning` stay registry items that `chat-page` depends on, with
  no docs pages of their own.

## Dual registry

`pnpm --filter @workspace/registry generate` writes:

1. GitHub: root `registry.json` and `packages/registry/src/generated.ts`
2. Hosted: `apps/docs/public/r/{name}.json`

`generate:check` fails if `registry.json`, `generated.ts`, or hosted
`apps/docs/public/r` drifted from item source. It also parses catalog rows
with `registryItemSchema` from `shadcn/schema`.

## Docs app

`pnpm --filter docs dev` → http://localhost:4567 (`--host`). The same origin
serves the hosted registry for local `shadcn add` (see `TESTING.md`).

Deploy is `pnpm --filter docs deploy` (`wrangler deploy`). Merge and deploy are
separate.
