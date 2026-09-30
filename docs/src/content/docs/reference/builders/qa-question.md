---
title: QAQuestion builder
description: Reference for the QAQuestion builder and its validated Schema.org Question output.
---

Creates a community-style Question for QAPage content. The `QAQuestion` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { QAQuestion } from '@unschema-graph/astro';

// Svelte 5
import { QAQuestion } from '@unschema-graph/svelte';

// Core / Node.js
import { QAQuestion } from '@unschema-graph/core';
import { QAQuestionSchema } from '@unschema-graph/core';
```

The `QAQuestionSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  QAQuestionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QAQuestionInput = SchemaInput<typeof QAQuestionSchema>;
type QAQuestionOutput = SchemaOutput<typeof QAQuestionSchema, 'Question'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `text` | string | No | — |
| `author` | string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | No | non-empty |
| `datePublished` | string \| number \| Date | No | non-empty |
| `acceptedAnswer` | object | No | — |
| `suggestedAnswer` | object \| Array<object> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Question'`.

## Minimal example

```ts
import { QAQuestion } from '@unschema-graph/core';

const entity = QAQuestion({
  "name": "How do I render JSON-LD in Astro?",
  "text": "I need a server-rendered graph."
});
```

## Output

```json
{
  "@type": "Question",
  "name": "How do I render JSON-LD in Astro?",
  "text": "I need a server-rendered graph."
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

Use `QAQuestion.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
