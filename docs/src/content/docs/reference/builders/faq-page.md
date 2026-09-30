---
title: FAQPage builder
description: Reference for the FAQPage builder and its validated Schema.org FAQPage output.
---

Creates an FAQPage and supports concise question-and-answer input. The `FAQPage` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { FAQPage } from '@unschema-graph/astro';

// Svelte 5
import { FAQPage } from '@unschema-graph/svelte';

// Core / Node.js
import { FAQPage } from '@unschema-graph/core';
import { FAQPageSchema } from '@unschema-graph/core';
```

The `FAQPageSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  FAQPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type FAQPageInput = SchemaInput<typeof FAQPageSchema>;
type FAQPageOutput = SchemaOutput<typeof FAQPageSchema, 'FAQPage'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `mainEntity` | Array<object> | Conditional | — |
| `questions` | Array<object> | Conditional | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'FAQPage'`.

## Minimal example

```ts
import { FAQPage } from '@unschema-graph/core';

const entity = FAQPage({
  "questions": [
    {
      "question": "What is Astro?",
      "answer": "A web framework for content-driven sites."
    }
  ]
});
```

## Output

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Astro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A web framework for content-driven sites."
      }
    }
  ]
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org FAQPage](https://schema.org/FAQPage) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `FAQPage.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
