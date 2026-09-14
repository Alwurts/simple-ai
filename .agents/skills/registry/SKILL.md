---
name: registry
description: Add or change simple-ai registry items. Dual generate (GitHub + hosted /r), generate:check, mocked gallery and chat-page, item.ts defs, documented vs internal items. Load before editing packages/registry or apps/docs/public/r.
---

# Registry

## Generate

After changing anything under `packages/registry/registry/`:

```bash
pnpm --filter @workspace/registry generate
pnpm --filter @workspace/registry generate:check
```

Commit all of: `registry.json`, `packages/registry/src/generated.ts`,
`apps/docs/public/r`. Do not hand-edit those outputs.

## Item source

Each item is a directory with `item.ts` (`RegistryItemDef`) and its files.
`item.files[].path` is relative to that directory. `preview` is the
extensionless file generate lazy-loads.

- Components: `packages/registry/registry/components/<name>/`
- Blocks: `packages/registry/registry/blocks/<name>/`

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
