# Release Policy & Process

This document defines the versioning policy, quality gates, and release procedures for the `@unschema-graph` monorepo.

---

## 1. Versioning & SemVer Policy

All publishable packages (`@unschema-graph/core`, `@unschema-graph/astro`, `@unschema-graph/svelte`) follow [Semantic Versioning 2.0.0](https://semver.org/):

### Pre-1.0 policy

Before `1.0.0`, the public API is still stabilizing:

- `0.x.y` PATCH releases are reserved for bug fixes and documentation/internal changes.
- `0.x.0` MINOR releases may include documented breaking API changes when required to prepare the stable v1 contract (such as the `0.10.0` public API freeze).
- Breaking changes must be explicitly described in migration notes and Changesets.

### 1.x+ policy

From `1.0.0` onward:

- **PATCH**: Backward-compatible bug fixes without changing public API signatures or making documented valid input invalid.
- **MINOR**: Backward-compatible additions (new Schema.org builders, optional schema properties, new utility helpers, new documented entry points).
- **MAJOR**: Breaking changes (removal/renaming of public symbols, changing output AST/JSON-LD structure, rejecting previously valid inputs, changing graph resolution semantics).

### Public API Surface

Only symbols exported through documented entry points in `package.json#exports` form the contract governed by SemVer:
- `@unschema-graph/core`: `.`, `./audit`
- `@unschema-graph/astro`: `.`, `./integration`, `./content`, `./Schema.astro`
- `@unschema-graph/svelte`: `.`, `./Schema.svelte`

Deep imports (e.g., `dist/*`, `src/*`, internal schemas, or unpublished utilities) are strictly private implementation details.

---

## 2. Release Roadmap towards 1.0.0

```text
0.9.0 (v1 stabilization candidate)
  ↓
0.10.0 (Public API cleanup & contract freeze)
  ↓
1.0.0-rc.1 (Release Candidate — final pre-release testing)
  ↓
1.0.0 (Stable release)
```

> **RC Stability Rule:** After `1.0.0-rc.1`, no public API will be renamed, removed, or structurally altered. Only critical bug fixes addressing confirmed defects are accepted ahead of `1.0.0`.

---

## 3. Pre-Flight Verification Gate

Before any release (pre-release or stable), the comprehensive automated quality gate must succeed:

```bash
pnpm run release:check
```

This gate executes:
1. **Code Standards:** Biome formatting and linting (`biome check --error-on-warnings .`).
2. **Type Safety:** Typechecks across all packages and examples (`tsc --noEmit`).
3. **Automated Tests:** Full unit and integration test suite (`vitest run`).
4. **Build Pipelines:** Builds all monorepo packages, examples, and Starlight documentation.
5. **Static JSON-LD Audit:** Strict Schema.org graph validation on built static output (`audit:strict`).
6. **Documentation Health:** Validates internal links, markdown output, and EN/FR translation parity.
7. **Production Tarball Verification:** Generates real `.tgz` archives and verifies installation/compilation against external peer versions (Astro 5/6/7, Svelte 5, Zod 4, and Node.js >=22.12.0).

---

## 4. Release Procedures

We use [Changesets](https://github.com/changesets/changesets) for managing versioning and changelogs.

### Standard Workflow (Development / Releases)

1. **Create a Changeset:**
   ```bash
   pnpm changeset
   ```
   Select impacted packages and specify the bump type (`patch`, `minor`, `major`) with a concise explanation.

2. **Run Verification Gate:**
   ```bash
   pnpm run release:check
   ```

3. **Version Packages:**
   ```bash
   pnpm run version-packages
   ```
   Updates package versions and generates updated `CHANGELOG.md` files.

4. **Publish to npm:**
   ```bash
   pnpm run release
   ```
   Publishes packages to npm with provenance.

---

### Release Candidate (RC) Workflow

When preparing a Release Candidate:

1. **Enter Pre-Release Mode:**
   ```bash
   pnpm run pre-rc
   ```
   Configures Changesets to produce `1.0.0-rc.X` pre-releases.

2. **Bump and Version:**
   ```bash
   pnpm run version-packages
   ```

3. **Publish with `rc` tag:**
   ```bash
   pnpm run release:rc
   ```
   Publishes packages under the npm `rc` dist-tag (`npm install @unschema-graph/core@rc`), leaving `@latest` unaffected.

4. **Exit Pre-Release Mode (for Stable):**
   ```bash
   pnpm run exit-pre
   pnpm run version-packages
   pnpm run release
   ```
