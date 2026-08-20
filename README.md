# simple-ai

Copy-paste AI chat UI. A TipTap chat input and a full-page chat block.

[simple-ai.dev](https://simple-ai.dev)

## Stack

TanStack Start, Fumadocs, Cloudflare Workers, shadcn Base UI. Hosted registry at `/r/{name}.json`, GitHub registry via root `registry.json`.

## Develop

```bash
pnpm install
pnpm --filter @workspace/registry generate
pnpm --filter docs dev
```

Docs: http://localhost:4567
