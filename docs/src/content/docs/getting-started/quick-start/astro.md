---
title: Your first schema with Astro
description: Render a validated Article as JSON-LD in an Astro page in less than five minutes.
---

This guide starts with one `Article`. You will see the generated JSON-LD before learning
how to connect a complete page graph.

## Before you start

You need Node.js 22.12 or newer and an Astro 5, 6, or 7 project.

## 1. Install

For automatic installation and configuration:

```bash
npx astro add @unschema-graph/astro
```

Or install the package manually:

```bash
pnpm add @unschema-graph/astro zod
```

Using npm, yarn, or bun? See [all installation commands](/getting-started/installation/).

For a manual integration setup, register the package root in `astro.config.mjs`:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import schemaGraph from '@unschema-graph/astro';

export default defineConfig({
  integrations: [schemaGraph()],
});
```

## 2. Add an Article

Create or open an Astro page and render `<Schema />` inside its `<head>`:

```astro title="src/pages/hello.astro"
---
import { Article, Schema } from '@unschema-graph/astro';

const article = Article({
  headline: 'My first typed JSON-LD',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});
---

<html lang="en">
  <head>
    <title>{article.headline}</title>
    <Schema item={article} graph={false} />
  </head>
  <body><h1>{article.headline}</h1></body>
</html>
```

The builder checks required fields with Zod. Astro renders the component on the server,
so this example adds no client-side JavaScript.

## 3. Check the output

Open the page source and find:

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"My first typed JSON-LD"}
</script>
```

The real script also contains the image, publication date, and author. The shortened
output above shows the structure to look for.

## 4. Grow into a page graph

A production article usually belongs to a `WebPage` and `WebSite`, has a publisher
`Organization`, and references those entities with stable `@id` values. Pass them
together with `items={[organization, website, page, article]}` instead of rendering
separate scripts.

[Build that connected graph](/guides/mental-model/).

## Next step

Learn [what builders, entities, identities, and graphs mean](/guides/mental-model/), or
open the [complete Astro integration reference](/integrations/astro/).
