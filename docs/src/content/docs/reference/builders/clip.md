---
title: Clip builder
description: Reference for the Clip builder and its validated Schema.org Clip output.
---

Creates a Clip describing a video chapter or key moment. The `Clip` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Clip } from '@unschema-graph/astro';

// Svelte 5
import { Clip } from '@unschema-graph/svelte';

// Core / Node.js
import { Clip } from '@unschema-graph/core';
import { ClipSchema } from '@unschema-graph/core';
```

The `ClipSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ClipSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ClipInput = SchemaInput<typeof ClipSchema>;
type ClipOutput = SchemaOutput<typeof ClipSchema, 'Clip'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `startOffset` | number | Yes | minimum: 0 |
| `endOffset` | number | Yes | greater than 0 |
| `url` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Clip'`.

## Minimal example

```ts
import { Clip } from '@unschema-graph/core';

const entity = Clip({
  "name": "Installation",
  "startOffset": 0,
  "endOffset": 42
});
```

## Output

```json
{
  "@type": "Clip",
  "name": "Installation",
  "startOffset": 0,
  "endOffset": 42
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Clip](https://schema.org/Clip)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Clip.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
