---
title: Migration to v1
description: Upgrade guide, architectural evolutions, and migration patterns for unschema-graph 1.0.
---

`unschema-graph` 1.0 stabilizes the public API, introduces relational entity-object references, enforces strict Schema.org validation with Zod, and brings deterministic graph discovery.

> **Note on Version 0.9.0 (v1 Release Candidate)**
> Release **0.9.0** serves as the official feature-complete release candidate ahead of 1.0.0. It stabilizes the complete architecture and public API. If you are upgrading from an earlier pre-1.0 setup, this guide covers all architectural evolutions and best practices.

---

## What’s New & Changed in v1

### 1. Relational Entity-Object References

In pre-1.0 versions or manual setups, linking entities required keeping string identifiers in sync (e.g. `publisher: '#organization'`).
In v1, you can pass builder-created entity objects directly:

```ts
// Before: string identifiers only
const article = Article({
  headline: 'Hello World',
  publisher: '#organization',
});

// In v1: fully-typed entity-object reference
const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Hello World',
  publisher: organization, // Typed and checked by TypeScript
});
```

### 2. Automatic Graph Discovery

You no longer need to manually gather every connected entity into an array when serializing. Passing a root node recursively discovers all referenced entities with an `@id`:

```ts
// In v1: passing just the root entity discovers website and organization
const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://example.com',
});
```

### 3. Strict Schema.org Typing & Additional Properties

All 51 builders enforce strict Schema.org properties. Unknown properties that do not exist on the Schema.org definition are rejected at build time.

If your CMS or API requires custom properties:
- Use `withAdditionalProperties`:
  ```ts
  import { Article, withAdditionalProperties } from '@unschema-graph/core';

  const CustomArticle = withAdditionalProperties(Article, ['customField']);
  ```
- Or define custom types with `defineSchema`.

### 4. Structured Graph Diagnostics (`onDiagnostic`)

Instead of silent failures or unexpected merges, graph construction provides an optional `onDiagnostic` callback to inspect `broken-reference` and `duplicate-conflict` events:

```ts
const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://example.com',
  onDiagnostic(diagnostic) {
    console.warn(`[${diagnostic.code}] ${diagnostic.message}`);
  },
});
```

### 5. Audit CLI in CI

The audit CLI is stabilized for CI usage with strict mode:
```bash
npx @unschema-graph/core audit dist --strict
```
It returns exit code `0` on success and `1` if broken references or malformed JSON-LD scripts are detected.

---

## Step-by-Step Upgrade Checklist

1. **Update packages together:** Update `@unschema-graph/core`, `@unschema-graph/astro`, and `@unschema-graph/svelte` to `^1.0.0`.
2. **Review builder calls:** Ensure required fields are provided according to the Schema.org builder documentation.
3. **Adopt entity-object references:** Replace error-prone string identifiers with direct object references where applicable.
4. **Configure `baseUrl`:** Ensure `baseUrl` (or Astro's `site` in `astro.config.mjs`) is set so fragment references resolve to canonical absolute URLs.
5. **Run typecheck and audit:** Run `pnpm run typecheck` and `npx @unschema-graph/core audit dist --strict` to verify clean graph resolution.
