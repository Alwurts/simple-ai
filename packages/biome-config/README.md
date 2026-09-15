# `@workspace/biome-config`

Repo-owned Biome presets forked from Ultracite (`core` / `react` / `tanstack`).

Root `biome.jsonc` extends:

- `@workspace/biome-config/core`
- `@workspace/biome-config/react`
- `@workspace/biome-config/tanstack`

## Plugins (ALW-672)

GritQL plugins under `plugins/` ban casual `useEffect` / `useLayoutEffect`
outside vendored shadcn. Wired from root `biome.jsonc`. See
`docs/engineering/code-smells.md`.
