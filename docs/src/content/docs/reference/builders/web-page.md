---
title: WebPage builder
description: Reference for the WebPage builder and its validated Schema.org WebPage output.
---

Creates general WebPage metadata and page relationships. The `WebPage` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebPage } from '@unschema-graph/astro';

// Svelte 5
import { WebPage } from '@unschema-graph/svelte';

// Core / Node.js
import { WebPage } from '@unschema-graph/core';
import { WebPageSchema } from '@unschema-graph/core';
```

The `WebPageSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  WebPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebPageInput = SchemaInput<typeof WebPageSchema>;
type WebPageOutput = SchemaOutput<typeof WebPageSchema, 'WebPage'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | No | — |
| `url` | string | No | — |
| `headline` | string | No | — |
| `description` | string | No | — |
| `inLanguage` | string | No | — |
| `speakable` | string \| Array<string> \| object | No | — |
| `isPartOf` | string \| object | No | — |
| `breadcrumb` | string \| object | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'WebPage'`.

## Minimal example

```ts
import { WebPage } from '@unschema-graph/core';

const entity = WebPage({
  "name": "About Acme",
  "url": "https://example.com/about"
});
```

## Output

```json
{
  "@type": "WebPage",
  "name": "About Acme",
  "url": "https://example.com/about"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: [Blog & media](/recipes/blog-media/), [Company site](/recipes/company-site/)
- External sources: [Schema.org WebPage](https://schema.org/WebPage)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `WebPage.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
