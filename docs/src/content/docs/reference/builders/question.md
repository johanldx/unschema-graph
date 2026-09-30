---
title: Question builder
description: Reference for the Question builder and its validated Schema.org Question output.
---

Creates an FAQ-style Question with an accepted answer. The `Question` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Question } from '@unschema-graph/astro';

// Svelte 5
import { Question } from '@unschema-graph/svelte';

// Core / Node.js
import { Question } from '@unschema-graph/core';
import { QuestionSchema } from '@unschema-graph/core';
```

The `QuestionSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  QuestionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QuestionInput = SchemaInput<typeof QuestionSchema>;
type QuestionOutput = SchemaOutput<typeof QuestionSchema, 'Question'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `acceptedAnswer` | object \| string | Yes | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Question'`.

## Minimal example

```ts
import { Question } from '@unschema-graph/core';

const entity = Question({
  "name": "What is JSON-LD?",
  "acceptedAnswer": "A linked-data serialization format."
});
```

## Output

```json
{
  "@type": "Question",
  "name": "What is JSON-LD?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "A linked-data serialization format."
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Question](https://schema.org/Question)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Question.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
