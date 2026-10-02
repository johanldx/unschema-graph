# Contributing to unschema-graph

First off, thank you for considering contributing to `unschema-graph`.

This document outlines the coding conventions, branch naming, and commit guidelines to ensure consistency across the monorepo.

## Local Development Setup

This project uses [pnpm](https://pnpm.io/) as its package manager and relies on workspaces.

1. Clone the repository and install dependencies:
   ```bash
   git clone [https://github.com/johanldx/unschema-graph.git](https://github.com/johanldx/unschema-graph.git)
   cd unschema-graph
   pnpm install
   ```
2. Run the complete quality gate:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm audit
   ```

## Branch Naming Conventions

Please create a dedicated branch for your work. We follow a strict naming convention based on the type of change:

- **Format:** `type/kebab-case-description`
- **Types:**
  - `feat/`: New features (e.g., `feat/add-recipe-schema`)
  - `fix/`: Bug fixes (e.g., `fix/astro-xss-vulnerability`)
  - `docs/`: Documentation updates (e.g., `docs/update-svelte-guide`)
  - `chore/`: Maintenance, dependency updates, or configuration (e.g., `chore/update-pnpm`)

## Commit Message Conventions

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This allows us to automatically generate changelogs and trigger npm releases.

- **Format:** `type(scope): description`
- **Allowed Scopes:**
  - `core` (for `@unschema-graph/core`)
  - `astro` (for `@unschema-graph/astro`)
  - `svelte` (for `@unschema-graph/svelte`)
  - `docs` (for the Starlight documentation site)
  - `repo` (for global monorepo configuration)

**Examples:**
- `feat(core): add deduplication logic to graph node`
- `fix(astro): resolve hydration mismatch on script tag`
- `docs: fix typo in README`
- `chore(repo): update vitest to latest version`

## Pull Request Process

1. Ensure lint, typecheck, tests, build, and audit all pass locally (`pnpm run release:check`).
2. Open a Pull Request against the `main` branch.
3. Fill out the provided Pull Request template completely.
4. Once approved, the PR will be merged using the **Squash and merge** strategy to keep the `main` history clean.

## Release Process

For the progressive release trajectory toward v1, pre-release tagging (`rc`), and quality gates, please refer to [RELEASE.md](./RELEASE.md).

