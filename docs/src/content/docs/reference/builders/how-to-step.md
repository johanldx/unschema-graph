---
title: HowToStep builder
description: Reference for the HowToStep builder and its validated Schema.org HowToStep output.
---

Creates a reusable HowToStep entity. The `HowToStep` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { HowToStep } from '@unschema-graph/astro';

// Svelte 5
import { HowToStep } from '@unschema-graph/svelte';

// Core / Node.js
import { HowToStep } from '@unschema-graph/core';
import { HowToStepSchema } from '@unschema-graph/core';
```

The `HowToStepSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  HowToStepSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HowToStepInput = SchemaInput<typeof HowToStepSchema>;
type HowToStepOutput = SchemaOutput<typeof HowToStepSchema, 'HowToStep'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | No | — |
| `text` | string | Yes | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `url` | string | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'HowToStep'`.

## Minimal example

```ts
import { HowToStep } from '@unschema-graph/core';

const entity = HowToStep({
  "text": "Build the Astro project."
});
```

## Output

```json
{
  "@type": "HowToStep",
  "text": "Build the Astro project."
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org HowToStep](https://schema.org/HowToStep)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `HowToStep.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
