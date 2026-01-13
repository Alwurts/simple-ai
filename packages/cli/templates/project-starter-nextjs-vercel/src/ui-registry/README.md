# UI Registry

This directory contains the UI component registry system for the project starter.

## Structure

```
src/ui-registry/
├── scripts/
│   └── build-registry.mts    # Build script that generates registry files
├── registry/
│   ├── index.ts              # Main registry export
│   ├── schema.ts             # Zod schemas for validation
│   ├── __index__.tsx         # Auto-generated (lazy-loaded components)
│   ├── __blocks__.json       # Auto-generated (block metadata)
│   ├── registry-ui.ts        # UI components registry
│   ├── registry-blocks.ts    # Blocks registry
│   ├── registry-examples.ts
│   ├── registry-hooks.ts
│   ├── registry-lib.ts
│   ├── ui/                   # UI component source files
│   ├── blocks/               # Block source files
│   ├── examples/
│   ├── hooks/
│   └── lib/
├── components/
│   ├── block-viewer.tsx      # Registry viewer component
│   └── block-display.tsx     # Registry display component
├── lib/
│   ├── registry.ts           # Registry utilities
│   ├── highlight-code.ts     # Syntax highlighting
│   └── get-icon-for-language.tsx  # File type icons
└── hooks/
    └── use-copy-to-clipboard.ts   # Copy to clipboard hook
```

## Usage

### Building the Registry

Run the build script to generate the registry index and JSON files:

```bash
npm run registry:build
```

This will:
1. Generate `__index__.tsx` with lazy-loaded React components
2. Create `__blocks__.json` with block metadata
3. Generate `registry.json` with all registry items
4. Run `shadcn build` to create individual JSON files in `public/r/`

### Adding Components

1. **UI Components**: Add component files to `src/ui-registry/registry/ui/`
2. **Blocks**: Add block files to `src/ui-registry/registry/blocks/`
3. **Register**: Add entries to the appropriate registry file (`registry-ui.ts`, `registry-blocks.ts`, etc.)

Example registry entry:

```typescript
{
  name: "my-component",
  type: "registry:ui",
  title: "My Component",
  description: "A description of the component",
  files: [
    {
      path: "ui/my-component.tsx",
      type: "registry:ui"
    }
  ]
}
```

### Viewing Components

Components can be viewed in isolation at:
- `/view/[component-name]` - Full-page view
- Use `<BlockDisplay name="component-name" />` in your pages

### Installation Command

Users can install components via:
```bash
npx shadcn@latest add @project-starter/component-name
```

The registry JSON files in `public/r/` enable this functionality.
