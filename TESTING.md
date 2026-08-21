# Testing

## Registry drift

Generated files must match item source:

```bash
pnpm --filter @workspace/registry generate:check
```

If this fails, run `pnpm --filter @workspace/registry generate` and commit the output.

## Typecheck and lint

```bash
pnpm typecheck
pnpm lint:check
```

## Local `shadcn add`

The docs dev server serves the hosted registry at `http://127.0.0.1:4567/r/{name}.json`.

1. `pnpm --filter docs dev`
2. In a throwaway app (outside this repo):

```bash
npx shadcn@latest registry add @simple-ai=http://127.0.0.1:4567/r/{name}.json
npx shadcn@latest add @simple-ai/chat-page -y
```

The page UI lands at `src/features/assistant/page.tsx`. Wire a Next or Start route as in [Installation](apps/docs/content/docs/installation.mdx).

For a live model, also add `@simple-ai/chat-api-next` (Next.js) or `@simple-ai/chat-api-hono` (Hono). Start can add `@simple-ai/chat-handler` and call `handleChat` from a server route. Then switch `chat-transport.ts` to `DefaultChatTransport({ api: "/api/chat" })`. The gallery stays mocked.
