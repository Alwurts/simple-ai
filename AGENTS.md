# AGENTS.md

Tier-1 entry for anyone working in this repo, human or agent. Commands,
conventions, and an index. Follow the links for detail.

> `AGENTS.md` and `.claude/CLAUDE.md` are kept **byte-identical** — mirrored as
> real copies, not a symlink. Change one, copy it over the other.

## Commands

Run from the **monorepo root**:

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Generate registry | `pnpm --filter @workspace/registry generate` |
| Check generated files | `pnpm --filter @workspace/registry generate:check` |
| Docs dev (port 4567) | `pnpm --filter docs dev` |
| Typecheck | `pnpm typecheck` |
| Lint (check) | `pnpm lint:check` |
| Lint (fix) | `pnpm lint:fix` |

After changing a registry item, run `generate` and commit `registry.json`,
`packages/registry/src/generated.ts`, and `apps/docs/public/r`.

## Conventions

- This is a **shadcn registry of agent examples**, not a finished app and not a
  chat-component kit. `chat-page` is the 2D example you copy. `chat-card` is the
  in-world WebXR example. shadcn is how you add them.
- Gallery, `chat-page`, and `chat-card` stay **mocked**. Do not wire a live
  model into the docs site.
- Documented UI is listed in `apps/docs/content/docs/components/meta.json`.
  2D: `chat-input`, `tool`, `worked`. In-world: `world-card` and the `xr-*`
  pieces except `xr-button` (pulled in by `xr-chat-input`). `shell` and
  `reasoning` are registry internals that `chat-page` pulls in.
- Item `docs` / `envVars` (when present) are the CLI post-add instructions. Keep
  them in sync with Installation.
- Prefer no code comments. Comment only when names and types cannot express an
  invariant, hazard, or external constraint.
- Public host is `https://www.simple-ai.dev`. Hosted items are
  `/r/{name}.json`.

## Where things live

- **What the system is** → [`docs/architecture.md`](docs/architecture.md)
- **How to add or change a registry item** → skill `registry`
- **Human setup** → [`README.md`](README.md), [`CONTRIBUTING.md`](CONTRIBUTING.md)
- **Release** → [`RELEASING.md`](RELEASING.md)
- **Local `shadcn add` smoke** → [`TESTING.md`](TESTING.md)

## Skills

Canonical copies live in `.agents/skills/`. `.claude/skills/` is relative
symlinks into that tree.

| Skill | Why load it |
| --- | --- |
| `architecture` | Layout of apps/packages and the catalog rules |
| `registry` | Item defs, generate, dual registry, mocked gallery |

Load the matching skill before changing registry source or the docs app
structure.
