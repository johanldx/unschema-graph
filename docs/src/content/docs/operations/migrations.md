---
title: Migration to v1
description: Upgrade guide, architectural evolutions, and migration patterns for unschema-graph 1.0.
---

`unschema-graph` 1.0 stabilizes the public API, introduces relational entity-object references, enforces strict Schema.org validation with Zod, and brings deterministic graph discovery.

> **Version 0.10.0 — Public API Freeze**
> Release **0.10.0** freezes the public API contract across Core, Astro, and Svelte ahead of `1.0.0-rc.1`. If you are upgrading from `0.9.x` or earlier setups, this guide covers the cleanup and architectural changes.

---

## 0.9.x → 0.10.0 — Public API cleanup

Release `0.10.0` intentionally cleans up accidental root exports and internal primitives ahead of `1.0.0-rc.1`.

### 1. `createEntityRef` removed in favor of `entityRef`

The deprecated alias `createEntityRef` has been removed. Use `entityRef` instead:

```ts
// Before (deprecated):
import { createEntityRef } from '@unschema-graph/core';

// In 0.10.0+:
import { entityRef } from '@unschema-graph/core';
```

### 2. Internal helpers removed from root exports

Lower-level implementation primitives have been removed from the package roots to protect internal evolution:

- `resolveId` and `resolveEntityIds`: pass `baseUrl` to `buildJsonLdGraph(entities, { baseUrl })` instead of resolving IDs manually.
- `EntityIdSchema`, `isIdReference`, `IdObjectSchema`, `TypedEntitySchema`, and `EntityReferenceSchema`: use builder validation, `entityRef()`, or `withAdditionalProperties()` instead of validating ID strings or reference shapes directly.
- `normalizeZodIssues` and `formatZodError`: validation errors are automatically formatted by `SchemaValidationError` thrown by builders and `validateSchema()`.
- Common internal schemas (`WebUrlSchema`, `RelativeOrAbsoluteUrlSchema`, `SearchActionSchema`, `SpeakableSchema`, `ImageUrlOrObject`, `IsoDateSchema`, `IsoDurationSchema`): use documented high-level APIs such as `createSearchAction()`, `ImageObject()`, `formatIsoDate()`, and `formatIsoDuration()` where applicable.

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

#### Explicit string references

A string becomes an `@id` reference only when it explicitly looks like one: a fragment
(`#person`), a path (`/people/ada#person`, `./page`, `../page`), or an absolute URI. Plain names
are expanded only by relationships that define a fallback type, such as `Article.author`.
Generic relationships without a fallback reject plain names:

```ts
ProfilePage({ mainEntity: '#person' }); // Valid explicit reference
ProfilePage({ mainEntity: Person({ name: 'Ada Lovelace' }) }); // Valid direct entity
ProfilePage({ mainEntity: 'Ada Lovelace' }); // Validation error
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
