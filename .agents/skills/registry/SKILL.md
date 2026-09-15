---
name: registry
description: Add or change simple-ai registry items. Dual generate (GitHub + hosted /r), generate:check, mocked gallery and chat-page, ui/_registry.ts + examples, block folders. Load before editing packages/registry or apps/docs/public/r.
---

# Registry

## Generate

After changing anything under `packages/registry/registry/`:

```bash
pnpm --filter @workspace/registry generate
pnpm --filter @workspace/registry generate:check
```

Commit all of: `registry.json`, `packages/registry/src/generated.ts`,
`apps/docs/public/r`. Do not hand-edit those outputs. `generate:check` diffs
all three and parses items with `registryItemSchema` from `shadcn/schema`.

## Item source

- **UI** — one file in `packages/registry/registry/ui/<name>.tsx` and a row in
  `ui/_registry.ts`. `item.files[].path` is relative to `ui/`.
- **Demos** — `packages/registry/registry/examples/<name>-demo.tsx`. Docs
  only. Point at them with `preview` (extensionless path under `registry/`).
  Do not add demos to `registry.json`.
- **Blocks** — `packages/registry/registry/blocks/<name>/` with `item.ts`.
  `item.files[].path` is relative to that directory. `preview` is the
  extensionless file inside the block folder.

If the item has `docs` or `envVars`, keep them aligned with
`apps/docs/content/docs/installation.mdx`.

## Catalog

`apps/docs/content/docs/components/meta.json` is the public list. Items not on
that list can still exist as registry internals (`shell`, `reasoning` for
`chat-page`). Do not add docs pages for internals just because the item exists.

## Gallery stays mocked

`chat-page` and the blocks gallery use the scripted mock. Do not point the docs
site at a live `/api/chat`. A consumer app can switch `chat-transport.ts` after
add; that is outside this repo's gallery.

## Checks before a PR

```bash
pnpm --filter @workspace/registry generate
pnpm --filter @workspace/registry generate:check
pnpm typecheck
pnpm lint:check
```
