## Workspace Commands

This project is a pnpm monorepo organized under `@unschema-graph`:

- Build all packages: `pnpm run build`
- Run test suite: `pnpm test`
- Typecheck all workspaces: `pnpm run typecheck`
- Audit Schema.org JSON-LD in example build: `pnpm run audit`
- Run Starlight documentation site in dev mode: `pnpm run dev:docs`
- Run Core TypeScript playground example: `pnpm run dev:core`
- Run Astro playground example in dev mode: `pnpm run dev:astro`
- Run Svelte 5 playground example in dev mode: `pnpm run dev:svelte`

## Architecture

- `packages/core`: Universal TypeScript engine (51 Zod schemas, @graph resolution, Unicode serializer, durations, audit CLI).
- `packages/astro`: Astro integration, `<Schema />` component, Dev Toolbar app, and Content Collections helpers.
- `packages/svelte`: Svelte 5 component (`<Schema />` using runes) with full core re-export.
- `docs`: Starlight documentation site.
- `examples/core`: Standalone TypeScript / Node playground demonstrating universal graph generation, serialization, and HTML generation.
- `examples/astro`: Astro playground application demonstrating rich result features.
- `examples/svelte`: Svelte 5 playground application demonstrating reactive runes with Schema.org.
