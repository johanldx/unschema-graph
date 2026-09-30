---
title: HowToSection builder
description: Reference for the HowToSection builder and its validated Schema.org HowToSection output.
---

Creates a named section containing validated HowToStep entities. The `HowToSection` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { HowToSection } from '@unschema-graph/astro';

// Svelte 5
import { HowToSection } from '@unschema-graph/svelte';

// Core / Node.js
import { HowToSection } from '@unschema-graph/core';
import { HowToSectionSchema } from '@unschema-graph/core';
```

The `HowToSectionSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  HowToSectionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HowToSectionInput = SchemaInput<typeof HowToSectionSchema>;
type HowToSectionOutput = SchemaOutput<typeof HowToSectionSchema, 'HowToSection'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `itemListElement` | Array<object> | Yes | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'HowToSection'`.

## Minimal example

```ts
import { HowToSection } from '@unschema-graph/core';

const entity = HowToSection({
  "name": "Deployment",
  "itemListElement": [
    {
      "text": "Build the Astro project."
    }
  ]
});
```

## Output

```json
{
  "@type": "HowToSection",
  "name": "Deployment",
  "itemListElement": [
    {
      "@type": "HowToStep",
      "text": "Build the Astro project."
    }
  ]
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org HowToSection](https://schema.org/HowToSection)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `HowToSection.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
