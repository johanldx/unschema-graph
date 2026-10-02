---
title: ListItem builder
description: Reference for the ListItem builder and its validated Schema.org ListItem output.
---

Creates a positioned ListItem for lists and breadcrumbs. The `ListItem` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { ListItem } from '@unschema-graph/astro';

// Svelte 5
import { ListItem } from '@unschema-graph/svelte';

// Core / Node.js
import { ListItem } from '@unschema-graph/core';
import { ListItemSchema } from '@unschema-graph/core';
```

The `ListItemSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ListItemSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ListItemInput = SchemaInput<typeof ListItemSchema>;
type ListItemOutput = SchemaOutput<typeof ListItemSchema, 'ListItem'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `position` | number | No | integer; greater than 0; maximum: 9007199254740991 |
| `name` | string | Yes | non-empty |
| `item` | string | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'ListItem'`.

## Minimal example

```ts
import { ListItem } from '@unschema-graph/core';

const entity = ListItem({
  "name": "First result",
  "position": 1,
  "item": "/results/first"
});
```

## Output

```json
{
  "@type": "ListItem",
  "position": 1,
  "name": "First result",
  "item": "/results/first"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org ListItem](https://schema.org/ListItem)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `ListItem.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
