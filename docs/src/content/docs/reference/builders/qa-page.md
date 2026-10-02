---
title: QAPage builder
description: Reference for the QAPage builder and its validated Schema.org QAPage output.
---

Creates a QAPage around a community-style Question. The `QAPage` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { QAPage } from '@unschema-graph/astro';

// Svelte 5
import { QAPage } from '@unschema-graph/svelte';

// Core / Node.js
import { QAPage } from '@unschema-graph/core';
import { QAPageSchema } from '@unschema-graph/core';
```

The `QAPageSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  QAPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QAPageInput = SchemaInput<typeof QAPageSchema>;
type QAPageOutput = SchemaOutput<typeof QAPageSchema, 'QAPage'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `mainEntity` | [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | Yes | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'QAPage'`.

## Minimal example

```ts
import { QAPage } from '@unschema-graph/core';

const entity = QAPage({
  "mainEntity": {
    "name": "How do I render JSON-LD in Astro?"
  }
});
```

## Output

```json
{
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": "How do I render JSON-LD in Astro?"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org QAPage](https://schema.org/QAPage)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `QAPage.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
