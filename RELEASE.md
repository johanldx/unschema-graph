# Release Process toward v1

This document specifies the release trajectory and verification gates for `unschema-graph` according to the v1 migration roadmap.

---

## 1. Release Trajectory

To guarantee maximum reliability and prevent premature breaking changes in the stable branch, releases follow a staged, progressive trajectory:

```text
0.x (Iterative hardening & refactoring)
 ↓
[x] Refactor relational entity model (Step 3)
[x] Unified graph collector & node hoisting (Steps 4 & 5)
[x] Canonical identifier & URL resolution (Step 6)
[x] Deterministic node merge & deduplication (Step 7)
[x] Validation & Schema.org / Google guidelines alignment (Steps 9–13)
[x] Audit CLI & CI diagnostics (Step 14)
[x] Astro Dev Toolbar & Svelte 5 SSR hardening (Steps 15 & 16)
[x] Security: Anti-XSS Unicode serializer (Step 19)
[x] API polish, golden snapshots, and benchmarks (Step 20)
[x] Real consumer npm tarball testing (Steps 18 & 22)
[x] Documentation v1 & Onboarding journey (Step 23)
[x] Backwards compatibility & 0.x migration tests (Step 24)
 ↓
0.9.0 (Feature-complete stabilization release)
 ↓
1.0.0-rc.1 (Release Candidate)
 ↓
Dogfooding & real-world testing across production Astro & Svelte sites
 ↓
Targeted patches (bug fixes without conceptual API restructurings)
 ↓
1.0.0 (Stable v1 Release)
```

> **Guiding Principle:**
> Do not cut `1.0.0` as long as any part of the public API is under consideration for renaming or structural alteration.

---

## 2. Pre-Release Verification Checklist

Before publishing any release candidate or stable version, the comprehensive quality gate must pass:

```bash
pnpm run release:check
```

This automated gate runs:
1. **Linting & formatting check:** `biome check --error-on-warnings .`
2. **Typecheck:** `pnpm run typecheck` across all 7 workspace packages.
3. **Unit & integration test suites:** `vitest run` (24 suites, 224+ tests).
4. **HTML output audit:** `unschema-graph audit examples/astro/dist --strict`.
5. **Real-world tarball installation test:** `node scripts/test-published-packages.mjs` (packs actual `.tgz` archives and verifies consumption under Astro 5, 6, 7 and SvelteKit).

---

## 3. Pre-Release (Release Candidate) Workflow

When ready to publish a Release Candidate:

### Step 3.1: Enter Pre-Release Mode

```bash
pnpm run pre-rc
```
This configures Changesets into pre-release mode targeting tag `rc`.

### Step 3.2: Version Packages

```bash
pnpm run version-packages
```
This updates `@unschema-graph/*` versions to `1.0.0-rc.X` and generates changelogs.

### Step 3.3: Publish Release Candidate

```bash
pnpm run release:rc
```
Packages are published to npm under the `rc` dist-tag (e.g. `npm install @unschema-graph/core@rc`), keeping the `@latest` dist-tag untouched for production users.

---

## 4. Graduating to Stable 1.0.0

After successful dogfooding and real-world validation without conceptual defects:

### Step 4.1: Exit Pre-Release Mode

```bash
pnpm run exit-pre
```

### Step 4.2: Final Versioning & Review

```bash
pnpm run version-packages
```
This graduates packages to `1.0.0` and finalizes `CHANGELOG.md`.

### Step 4.3: Final Pre-Flight Quality Gate

```bash
pnpm run release:check
```

### Step 4.4: Publish Stable 1.0.0

```bash
pnpm run release
```
Packages are published with npm provenance to the `@latest` dist-tag. The GitHub release `v1.0.0` is created automatically.
