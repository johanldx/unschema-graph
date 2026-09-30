---
title: BreadcrumbList builder
description: Reference for the BreadcrumbList builder and its validated Schema.org BreadcrumbList output.
---

Creates breadcrumbs and assigns one-based positions automatically. The `BreadcrumbList` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { BreadcrumbList } from '@unschema-graph/astro';

// Svelte 5
import { BreadcrumbList } from '@unschema-graph/svelte';

// Core / Node.js
import { BreadcrumbList } from '@unschema-graph/core';
import { BreadcrumbListSchema } from '@unschema-graph/core';
```

The `BreadcrumbListSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  BreadcrumbListSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BreadcrumbListInput = SchemaInput<typeof BreadcrumbListSchema>;
type BreadcrumbListOutput = SchemaOutput<typeof BreadcrumbListSchema, 'BreadcrumbList'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `itemListElement` | Array<object> | Yes | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'BreadcrumbList'`.

## Minimal example

```ts
import { BreadcrumbList } from '@unschema-graph/core';

const entity = BreadcrumbList({
  "itemListElement": [
    {
      "name": "Home",
      "item": "/"
    },
    {
      "name": "Guides",
      "item": "/guides/"
    },
    {
      "name": "Current page"
    }
  ]
});
```

## Output

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Guides",
      "item": "/guides/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current page"
    }
  ]
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: [Blog & media](/recipes/blog-media/)
- External sources: [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `BreadcrumbList.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
