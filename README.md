# unschema-graph

<p align="center">
  <strong>Ship valid Schema.org JSON-LD without maintaining raw JSON objects by hand.</strong><br>
  Compose typed entities in TypeScript, validate with Zod, resolve references into a single <code>@graph</code>, and serialize safely for modern web frameworks.
</p>

<p align="center">
  <a href="https://github.com/johanldx/unschema-graph/releases"><img src="https://img.shields.io/badge/version-v0.2.0-blue.svg" alt="Version 0.2.0" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/core"><img src="https://img.shields.io/npm/v/@unschema-graph/core?color=6366f1&label=%40unschema-graph%2Fcore" alt="Core npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/astro"><img src="https://img.shields.io/npm/v/@unschema-graph/astro?color=f97316&label=%40unschema-graph%2Fastro" alt="Astro npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/svelte"><img src="https://img.shields.io/npm/v/@unschema-graph/svelte?color=ff3e00&label=%40unschema-graph%2Fsvelte" alt="Svelte npm version" /></a>
  <a href="https://unschema-graph.jhdx.dev/"><img src="https://img.shields.io/badge/Documentation-unschema--graph.jhdx.dev-8b5cf6.svg" alt="Documentation" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

> [!NOTE]
> `unschema-graph` is currently at version **`v0.2.0`**. All public APIs are fully typed, tested, and documented. Breaking changes are announced via [Changesets](https://github.com/johanldx/unschema-graph/tree/main/.changeset).

---

## Why unschema-graph?

Writing Schema.org JSON-LD by hand in string templates or raw objects is fragile:
- ❌ **Silent typos**: Misspelled properties like `publsher` or missing required fields go completely unnoticed until Google Search Console complains weeks later.
- ❌ **Broken links**: Connecting entities across pages with `#id` requires manual duplication and error-prone cross-referencing.
- ❌ **XSS & Script Breakouts**: Raw `JSON.stringify()` does not escape `</script>` tags or HTML comment blocks, creating subtle injection vulnerabilities.

`unschema-graph` replaces manual objects with **typed, composable builders** that assemble into a clean, unified knowledge graph for search engines and AI scrapers.

```ts
import { Article, Organization, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

// 1. Fully typed & Zod-validated entities
const publisher = Organization({
  '@id': '#publisher',
  name: 'Acme Media',
  url: 'https://example.com'
});

const article = Article({
  headline: 'Getting Started with Structured Data',
  author: 'Ada Lovelace',
  publisher: '#publisher' // Resolved automatically to the full @id
});

// 2. Resolved into a unified @graph with Unicode anti-XSS escaping
const jsonLd = serializeJsonLd(buildJsonLdGraph([publisher, article]));
```

---

## At a Glance

| Feature | What it does |
| :--- | :--- |
| **51 Schema.org Builders** | First-class TypeScript autocompletion for articles, events, products, reviews, businesses, recipes, and more. |
| **Zod Runtime Validation** | Catch invalid dates, missing required attributes, and invalid URLs during build time before deployment. |
| **Automatic Graph Resolution** | Link entities seamlessly with `#id` references. Deduplicates shared nodes into a single clean `@graph`. |
| **Zero Client-Side JS** | Renders static, pre-escaped `<script type="application/ld+json">` tags directly at compile time. |
| **Safe Unicode Escaping** | Replaces `<` and `>` with safe `\u003c` and `\u003e` characters to prevent premature `<script>` termination. |
| **Built-in HTML Audit CLI** | Scan your built HTML files in CI/CD to verify all JSON-LD scripts are valid before going live. |

---

## Framework Integrations

`unschema-graph` is built modularly with dedicated first-class adapters:

### 🚀 Astro (`@unschema-graph/astro`)

Zero client JavaScript `<Schema />` component, Astro Content Collections helpers, and an integrated **Dev Toolbar** app:

```astro
---
import { Article, Organization, Schema } from '@unschema-graph/astro';

const org = Organization({ '@id': '#org', name: 'Acme', url: 'https://example.com' });
const article = Article({ headline: 'Modern Astro SEO', publisher: '#org' });
---

<!-- Automatically resolves relative URLs against astro.config.mjs 'site' -->
<Schema data={[org, article]} />
```

👉 [Read the Astro Guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/astro/)

---

### 🧡 Svelte 5 & SvelteKit (`@unschema-graph/svelte`)

Native Svelte 5 component powered by reactive **runes** (`$derived`, `$props`) injecting directly into `<svelte:head>`:

```svelte
<script lang="ts">
  import { Article, Organization, Schema } from '@unschema-graph/svelte';

  let { title = 'Svelte 5 Structured Data' } = $props();

  const org = Organization({ '@id': '#org', name: 'Acme', url: 'https://example.com' });
  const article = $derived(Article({ headline: title, publisher: '#org' }));
</script>

<Schema items={[org, article]} baseUrl="https://example.com" />
```

👉 [Read the Svelte Guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/svelte/)

---

### 🌐 Universal Core (`@unschema-graph/core`)

Zero-dependency TypeScript engine suitable for any framework, Node.js script, or server runtime:

```bash
pnpm add @unschema-graph/core zod
```

👉 [Read the Core Guide](https://unschema-graph.jhdx.dev/getting-started/quick-start/core/)

---

## The 4-Step Pipeline

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  1. DEFINE   │ ──> │  2. RESOLVE  │ ──> │  3. RENDER   │ ──> │   4. AUDIT   │
  │ Typed Zod    │     │ Single unified│     │ Zero-JS HTML │     │ Static CLI   │
  │ builders     │     │ @graph node  │     │ script tag   │     │ in CI/CD     │
  └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Define**: Autocomplete valid properties with TypeScript and validate with Zod.
2. **Resolve**: Group disjoint entities and resolve internal `#references` into one coherent entity graph.
3. **Render**: Inject securely into your HTML layout with 0 runtime overhead for visitors.
4. **Audit**: Run `npx @unschema-graph/core audit dist` in your CI pipeline to catch regressions.

---

## Documentation & Recipes

Visit the full interactive documentation site at **[unschema-graph.jhdx.dev](https://unschema-graph.jhdx.dev/)**:

- 📖 **[Mental Model & Graph Composition](https://unschema-graph.jhdx.dev/guides/mental-model/)**
- 🛡️ **[Security & Anti-XSS Protection](https://unschema-graph.jhdx.dev/audit-and-quality/security/)**
- 🔍 **[Build Audit CLI Guide](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)**
- 📚 **[51 Schema.org Builders Catalog](https://unschema-graph.jhdx.dev/reference/builders/)**
- 🍳 **[Recipe: Blog & Media Publishing](https://unschema-graph.jhdx.dev/recipes/blog-media/)**
- 🍳 **[Recipe: E-Commerce & Products](https://unschema-graph.jhdx.dev/recipes/ecommerce/)**
- 🍳 **[Recipe: Local Businesses & Places](https://unschema-graph.jhdx.dev/recipes/local-business/)**

---

## License

MIT © [Johan Ledoux](https://github.com/johanldx)
