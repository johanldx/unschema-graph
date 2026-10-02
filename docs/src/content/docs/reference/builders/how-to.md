---
title: HowTo builder
description: Reference for the HowTo builder and its validated Schema.org HowTo output.
---

Creates a HowTo and converts string steps to HowToStep entities. The `HowTo` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { HowTo } from '@unschema-graph/astro';

// Svelte 5
import { HowTo } from '@unschema-graph/svelte';

// Core / Node.js
import { HowTo } from '@unschema-graph/core';
import { HowToSchema } from '@unschema-graph/core';
```

The `HowToSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  HowToSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HowToInput = SchemaInput<typeof HowToSchema>;
type HowToOutput = SchemaOutput<typeof HowToSchema, 'HowTo'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `step` | Array<string \| object> | Yes | minimum items: 1 |
| `description` | string | No | — |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `totalTime` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `estimatedCost` | string \| string \| object | No | non-empty |
| `supply` | string \| Array<string> \| Array<string \| object> | No | — |
| `tool` | string \| Array<string> \| Array<string \| object> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'HowTo'`.

## Minimal example

```ts
import { HowTo } from '@unschema-graph/core';

const entity = HowTo({
  "name": "Deploy an Astro site",
  "step": [
    "Build the site.",
    "Upload the generated files."
  ]
});
```

## Output

```json
{
  "@type": "HowTo",
  "name": "Deploy an Astro site",
  "step": [
    {
      "@type": "HowToStep",
      "text": "Build the site."
    },
    {
      "@type": "HowToStep",
      "text": "Upload the generated files."
    }
  ]
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org HowTo](https://schema.org/HowTo)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `HowTo.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
