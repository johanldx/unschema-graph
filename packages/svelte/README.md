# @unschema-graph/svelte

[![npm version](https://img.shields.io/npm/v/@unschema-graph/svelte.svg)](https://www.npmjs.com/package/@unschema-graph/svelte)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

Svelte 5 `<Schema />` component using native runes and `<svelte:head>`, with the complete `unschema-graph` core engine re-exported.

Designed for Svelte 5 and SvelteKit: supports server-side rendering (SSR), static prerendering, and reactive client navigation.

---

## Installation

```bash
# pnpm
pnpm add @unschema-graph/svelte zod

# npm
npm install @unschema-graph/svelte zod

# yarn
yarn add @unschema-graph/svelte zod

# bun
bun add @unschema-graph/svelte zod
```

---

## Usage

### In Svelte 5 or SvelteKit

```svelte
<script lang="ts">
  // src/routes/+page.svelte or component
  import { Article, Organization, Schema } from '@unschema-graph/svelte';

  let { data } = $props();

  const org = Organization({
    '@id': '#organization',
    name: 'Acme Corp',
    url: 'https://example.com',
  });

  const article = $derived(
    Article({
      '@id': '#article',
      headline: data.post.title,
      image: data.post.coverImage,
      datePublished: data.post.publishedAt,
      author: data.post.authorName,
      publisher: '#organization',
    })
  );
</script>

<!-- Injects a single unified @graph block into <svelte:head> -->
<Schema
  items={[org, article]}
  baseUrl="https://example.com"
  inLanguage="en"
/>

<main>
  <h1>{data.post.title}</h1>
</main>
```

### SvelteKit SSR & Prerendering

No separate adapter is required for SvelteKit. The `<Schema />` component uses Svelte's built-in `<svelte:head>`:
- **During SSR / Prerendering**: Renders the complete `<script type="application/ld+json">` tag directly into the server HTML.
- **During Client Navigation**: Reactively recalculates and updates the structured data script when `$derived` props change.

---

## Compatibility

| Dependency | Supported Range | Notes |
| :--- | :--- | :--- |
| **Svelte** | `^5.15.0` | Native runes implementation (`$props`, `$derived`); lower bound verified from the packed package. |
| **Node.js** | `>=22.12.0` | Oldest maintained LTS baseline tested in CI. |
| **Zod** | `^4.6.0` | Required by the bundled Core dependency's peer contract. |

---

## Documentation

- [Svelte Quick Start](https://unschema-graph.jhdx.dev/getting-started/quick-start/svelte/)
- [SvelteKit SSR Recipe](https://unschema-graph.jhdx.dev/recipes/sveltekit-ssr/)
- [Svelte Integration Reference](https://unschema-graph.jhdx.dev/integrations/svelte/)
- [51 Supported Builders](https://unschema-graph.jhdx.dev/reference/builders/)
- [Audit CLI & CI/CD](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)
- [Troubleshooting](https://unschema-graph.jhdx.dev/operations/troubleshooting/)

---

## License

MIT © [Johan Ledoux](https://github.com/johanldx)
