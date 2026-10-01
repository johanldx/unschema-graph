---
title: Migration to v1
description: Upgrade guide, architectural evolutions, and migration patterns for unschema-graph 1.0.
---

`unschema-graph` 1.0 stabilizes the public API, introduces relational entity-object references, enforces strict Schema.org validation with Zod, and brings deterministic graph discovery.

> **Version 0.9.0 — v1 stabilization candidate**
> Release **0.9.0** is the pre-v1 stabilization release. The actual Release Candidate will be `1.0.0-rc.1`, followed by stable `1.0.0`. If you are upgrading from an earlier pre-1.0 setup, this guide covers the relevant architectural changes.

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

The curated built-in schemas are modeled against the Schema.org 30.1 vocabulary baseline and reject properties outside each library schema. This is not a claim of complete Schema.org coverage.

If your CMS or API requires custom properties:
- Use `withAdditionalProperties`:
  ```ts
  import { Article, withAdditionalProperties } from '@unschema-graph/core';

  const article = Article({ headline: 'Hello World' });
  const customArticle = withAdditionalProperties(article, { customField: 'value' });
  ```
- Or define custom types with `defineSchema`.

### 3.1. Schema.org 30.1 vocabulary corrections

The 0.9 contract replaces the superseded `Restaurant.menu` property with `hasMenu`:

```ts
const restaurant = Restaurant({
  name: 'Chez Pierre',
  address: '15 Boulevard Saint-Germain, Paris',
  hasMenu: '/menu',
});
```

`servesCuisine` and `hasMenu` are accepted by `Restaurant`, not by the generic
`LocalBusiness`, `Store`, or lodging builders. `FAQPage.questions` and
`WebSite.searchUrl` remain documented input conveniences: they emit the current
`mainEntity` and `potentialAction` vocabulary respectively.

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
