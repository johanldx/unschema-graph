---
title: Answer builder
description: Reference for the Answer builder and its validated Schema.org Answer output.
---

Creates a standalone Answer entity. The `Answer` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Answer } from '@unschema-graph/astro';

// Svelte 5
import { Answer } from '@unschema-graph/svelte';

// Core / Node.js
import { Answer } from '@unschema-graph/core';
import { AnswerSchema } from '@unschema-graph/core';
```

The `AnswerSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  AnswerSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AnswerInput = SchemaInput<typeof AnswerSchema>;
type AnswerOutput = SchemaOutput<typeof AnswerSchema, 'Answer'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `text` | string | Yes | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Answer'`.

## Minimal example

```ts
import { Answer } from '@unschema-graph/core';

const entity = Answer({
  "text": "Use one validated graph per page."
});
```

## Output

```json
{
  "@type": "Answer",
  "text": "Use one validated graph per page."
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Answer](https://schema.org/Answer)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Answer.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
