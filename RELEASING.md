# Releasing

There is no npm app package. What we ship is the docs site and the registry JSON.

## Site (hosted registry)

1. `pnpm --filter @workspace/registry generate`
2. `pnpm --filter @workspace/registry generate:check`
3. Merge to `main`.
4. Deploy `apps/docs` (Cloudflare Worker). Hosted items are `https://www.simple-ai.dev/r/{name}.json`.

## GitHub registry

Root `registry.json` is the GitHub-registry manifest. `npx shadcn@latest add Alwurts/simple-ai/chat-page` reads that file from `main`.

## `create-simple-ai`

Do not publish new versions. After the new site is live, deprecate on npm:

```bash
npm deprecate create-simple-ai@"*" "Deprecated. Use: npx shadcn@latest add @simple-ai/chat-page — https://simple-ai.dev"
```
