---
title: Your first schema with Core
description: Build, validate, and serialize an Article with framework-neutral TypeScript.
---

Core produces the JSON-LD payload. Your application remains responsible for placing it
inside the final HTML document.

## Before you start

You need Node.js 22.12 or newer and a TypeScript project.

## 1. Install

```bash
pnpm add @unschema-graph/core zod
```

Using npm, yarn, or bun? See [all installation commands](/getting-started/installation/).

## 2. Build and serialize an Article

```ts title="src/schema.ts"
import { Article, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

const article = Article({
  headline: 'My first framework-neutral JSON-LD',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});

const payload = buildJsonLdGraph([article], { graph: false });
const jsonLd = serializeJsonLd(payload, { pretty: true });
```

`Article()` validates the input. `buildJsonLdGraph()` adds the Schema.org context, and
`serializeJsonLd()` escapes characters that could terminate an HTML script element.

## 3. Check the output

`jsonLd` contains:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "My first framework-neutral JSON-LD"
}
```

The actual payload also contains the image, publication date, and author. Insert the
serialized string as the text content of one `<script type="application/ld+json">`
element using your framework's server-rendering API.

## 4. Grow into a page graph

Build `Organization`, `WebSite`, and `WebPage` alongside the article, give shared nodes
stable `@id` values, and call `buildJsonLdGraph(items, { baseUrl })` with the complete
array.

[Build that connected graph](/guides/mental-model/).

## Next step

Learn [what builders, entities, identities, and graphs mean](/guides/mental-model/), or
open the [complete Core reference](/integrations/core/).
