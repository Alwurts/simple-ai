# Contributing to create-simple-ai

Thank you for your interest in contributing to `create-simple-ai`! This document provides guidelines and information for contributors.

## Development Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure

This is a monorepo using npm workspaces:

- `packages/cli/` - The main CLI package (`create-simple-ai`) that gets published to npm
  - `packages/cli/templates/` - Project templates that get bundled with the CLI
- `packages/docs/` - Documentation and component registry site (`@simple-ai/docs`, private)
- `scripts/` - Build and utility scripts

## Monorepo Commands

From the root directory:

```bash
# CLI development
npm run cli:dev      # Watch CLI changes
npm run cli:build    # Build CLI
npm run cli:test     # Run CLI tests

# Docs development
npm run docs:dev     # Start docs dev server
npm run docs:build   # Build docs

# All packages
npm run build        # Build everything
npm run test         # Run all tests
npm run lint         # Format all code
npm run typecheck    # Type check all packages
```

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.

## Contributing Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add a changeset: `npm run changeset`
4. Make your changes
5. Run tests: `npm test`
6. Submit a pull request

## Changesets

We use [Changesets](https://github.com/changesets/changesets) for version management and changelogs. When making changes that affect the published package:

```bash
npm run changeset
```

Follow the prompts to describe your changes. This will create a changeset file that will be used when releasing new versions.

## Release Process

See [RELEASING.md](./RELEASING.md) for detailed release instructions.

## Code Style

- We use [Biome](https://biomejs.dev/) for linting and formatting
- TypeScript is required for all code
- Follow existing patterns and conventions

## Need Help?

- Check existing issues and pull requests
- Join our discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
