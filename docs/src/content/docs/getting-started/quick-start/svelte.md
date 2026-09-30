---
title: Your first schema with Svelte
description: Render a reactive, validated Article as JSON-LD with Svelte 5 or SvelteKit.
---

This guide uses Svelte 5 runes to keep one `Article` synchronized with page state.

## Before you start

You need Node.js 22.12 or newer and a Svelte 5 or SvelteKit 2 project.

## 1. Install

```bash
pnpm add @unschema-graph/svelte zod
```

Using npm, yarn, or bun? See [all installation commands](/getting-started/installation/).

## 2. Add a reactive Article

```svelte title="src/routes/hello/+page.svelte"
<script lang="ts">
  import { Article, Schema } from '@unschema-graph/svelte';

  let headline = $state('My first reactive JSON-LD');
  const article = $derived(
    Article({
      headline,
      image: 'https://example.com/cover.jpg',
      datePublished: '2026-09-29',
      author: 'Ada Lovelace',
    })
  );
</script>

<Schema item={article} graph={false} baseUrl="https://example.com" inLanguage="en" />
<h1>{headline}</h1>
```

`<Schema />` writes into `<svelte:head>`. When `headline` changes, the derived entity and
the rendered JSON-LD change with it.

## 3. Check the output

Inspect the server-rendered page source and find:

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"My first reactive JSON-LD"}
</script>
```

The actual script contains every property passed to the builder.

## 4. Grow into a page graph

Add `Organization`, `WebSite`, and `WebPage` entities with stable `@id` values. Then
pass the complete set through
`items={[organization, website, page, article]}` and keep `baseUrl` explicit so Svelte
can resolve relative identities.

[Build that connected graph](/guides/mental-model/).

## Next step

Learn [what builders, entities, identities, and graphs mean](/guides/mental-model/), or
open the [complete Svelte integration reference](/integrations/svelte/).
