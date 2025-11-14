# Changesets

This directory contains changesets for versioning and changelog generation.

## What are Changesets?

Changesets are files that describe changes you've made. They're used to:
- Determine version bumps (patch/minor/major)
- Generate changelogs automatically
- Coordinate releases

## Adding a Changeset

Run `npm run changeset` and follow the prompts:

1. Select the type of change (patch/minor/major)
2. Write a summary of the change
3. A file will be created in `.changeset/`

## Changeset Format

```markdown
---
"create-simple-ai": patch
---

Fixed bug in template processing for SQLite databases
```

## When to Add Changesets

- **Before opening a PR** - Add a changeset describing your changes
- **When merging** - If a contributor forgot, add one when merging
- **Before releasing** - If you forgot, add one before running `npm run release`

## Changeset Types

- **patch** - Bug fixes, small improvements
- **minor** - New features, backwards compatible
- **major** - Breaking changes

## More Information

See [RELEASING.md](../RELEASING.md) for complete release documentation.
