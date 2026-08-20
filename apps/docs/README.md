# Docs app

Fumadocs documentation site for the SFab starter template. Built with TanStack Start, Vite, and the Cloudflare Vite plugin; deploys as a Cloudflare Worker.

## Commands

Run from the monorepo root:

| Task | Command |
|---|---|
| Dev server | `pnpm --filter docs dev` (port **4012**) |
| Build | `pnpm --filter docs build` |
| Type check | `pnpm --filter docs typecheck` |
| Wrangler types | `pnpm --filter docs cf-typegen` |

## Content

MDX pages live in `content/docs/`. The `fumadocs-mdx` postinstall step generates `.source/` — do not edit that folder by hand.

## Live UI demos

Register shared components in `src/components/mdx.tsx` (`getMDXComponents`) to render `@workspace/ui` pieces inside MDX. See `content/docs/components/button.mdx` for an example.
