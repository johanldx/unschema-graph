# unschema-graph

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![Documentation](https://img.shields.io/badge/Docs-unschema--graph.jhdx.dev-purple.svg)](https://unschema-graph.jhdx.dev/)

> Type-safe Schema.org JSON-LD builders and graph tooling for Core TypeScript, Astro, and Svelte 5.

Model only visible page content with typed builders, resolve and deduplicate entities into a single `@graph`, safely serialize JSON-LD with Unicode anti-XSS protection, and audit static build output in CI.

> [!IMPORTANT]
> `unschema-graph` is currently pre-1.0 (`0.1.x`). All public APIs are tested and documented. Breaking changes are tracked and announced via [Changesets](https://github.com/johanldx/unschema-graph/tree/main/.changeset).

---

## Packages

| Package | Environment | Purpose | Documentation |
| :--- | :--- | :--- | :--- |
| **[`@unschema-graph/core`](./packages/core)** | Universal TypeScript | 51 typed builders, Zod validation, `@graph` resolution, safe serialization, and the audit CLI. | [Core guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/core/) |
| **[`@unschema-graph/astro`](./packages/astro)** | Astro | Core engine + `<Schema />` component (0 KB client JS), Astro integration, Dev Toolbar app, Content Collections helpers. | [Astro guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/astro/) |
| **[`@unschema-graph/svelte`](./packages/svelte)** | Svelte 5 & SvelteKit | Core engine + native runes `<Schema />` component using `<svelte:head>`. | [Svelte guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/svelte/) |

---

## Choose Your Environment

### Astro

Install:

```bash
pnpm add @unschema-graph/astro zod
```

Use in an Astro page or layout:

```astro
---
import { Article, Organization, Schema } from '@unschema-graph/astro';

const org = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Getting Started with Structured Data',
  image: '/images/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});
---

<Schema data={[org, article]} />
```

Astro resolves relative `@id` and `url` values against `site` configured in `astro.config.mjs`.

---

### Svelte 5 & SvelteKit

Install:

```bash
pnpm add @unschema-graph/svelte zod
```

Use in a Svelte 5 component or route:

```svelte
<script lang="ts">
  import { Article, Organization, Schema } from '@unschema-graph/svelte';

  let { title = 'Svelte 5 Structured Data' } = $props();

  const org = Organization({
    '@id': '#organization',
    name: 'Acme',
    url: 'https://example.com',
  });

  const article = $derived(
    Article({
      headline: title,
      image: '/images/cover.jpg',
      datePublished: '2026-09-29',
      author: 'Ada Lovelace',
      publisher: '#organization',
    })
  );
</script>

<Schema items={[org, article]} baseUrl="https://example.com" />
```

---

### Core / Other Frameworks

Install:

```bash
pnpm add @unschema-graph/core zod
```

Use anywhere in Node.js or modern JavaScript/TypeScript:

```ts
import { Article, Organization, createGraph, serializeJsonLd } from '@unschema-graph/core';

const org = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Core TypeScript Structured Data',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});

const graph = createGraph([org, article], { baseUrl: 'https://example.com' });
const htmlScriptTag = `<script type="application/ld+json">${serializeJsonLd(graph)}</script>`;
```

---

## Static Build Audit CLI

Catch malformed JSON-LD scripts and broken graph structures in your build output before deploying:

```bash
npx @unschema-graph/core audit dist
```

Add to your CI/CD workflow:

```json title="package.json"
{
  "scripts": {
    "build": "astro build",
    "postbuild": "unschema-graph audit dist"
  }
}
```

---

## Schema.org Builders

`unschema-graph` includes **51 typed builders** covering editorial content, identities, local places, commerce, datasets, events, and navigation structures.

Explore the complete list with property tables, Zod constraints, and examples in the [Builders Reference](https://unschema-graph.jhdx.dev/reference/builders/).

---

## Key Documentation

- [Documentation home](https://unschema-graph.jhdx.dev/)
- [Choose an environment](https://unschema-graph.jhdx.dev/getting-started/choose-your-environment/)
- [Mental model & Graph composition](https://unschema-graph.jhdx.dev/guides/mental-model/)
- [Validation & Error modes](https://unschema-graph.jhdx.dev/guides/validation/)
- [Security & Anti-XSS escaping](https://unschema-graph.jhdx.dev/audit-and-quality/security/)
- [Audit CLI & CI/CD](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)
- [Troubleshooting by symptom](https://unschema-graph.jhdx.dev/operations/troubleshooting/)
- [AI implementation guide](https://unschema-graph.jhdx.dev/ai/implementation-guide/)

---

## License

MIT © [Johan Ledoux](https://github.com/johanldx)
