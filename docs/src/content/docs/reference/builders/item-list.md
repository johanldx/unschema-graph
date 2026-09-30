---
title: ItemList builder
description: Reference for the ItemList builder and its validated Schema.org ItemList output.
---

Creates an ItemList and assigns positions to its elements. The `ItemList` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { ItemList } from '@unschema-graph/astro';

// Svelte 5
import { ItemList } from '@unschema-graph/svelte';

// Core / Node.js
import { ItemList } from '@unschema-graph/core';
import { ItemListSchema } from '@unschema-graph/core';
```

The `ItemListSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ItemListSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ItemListInput = SchemaInput<typeof ItemListSchema>;
type ItemListOutput = SchemaOutput<typeof ItemListSchema, 'ItemList'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `itemListElement` | Array<object> | Yes | minimum items: 1 |
| `name` | string | No | — |
| `description` | string | No | — |
| `itemListOrder` | string | No | — |
| `numberOfItems` | number | No | integer; minimum: 0; maximum: 9007199254740991 |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'ItemList'`.

## Minimal example

```ts
import { ItemList } from '@unschema-graph/core';

const entity = ItemList({
  "name": "Featured guides",
  "itemListElement": [
    {
      "name": "Astro guide",
      "url": "/guides/astro"
    },
    {
      "name": "JSON-LD guide",
      "url": "/guides/json-ld"
    }
  ]
});
```

## Output

```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Astro guide",
      "url": "/guides/astro"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "JSON-LD guide",
      "url": "/guides/json-ld"
    }
  ],
  "name": "Featured guides"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org ItemList](https://schema.org/ItemList)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `ItemList.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
