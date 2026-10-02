---
title: Comment builder
description: Reference for the Comment builder and its validated Schema.org Comment output.
---

Creates a Comment for discussion and Q&A content. The `Comment` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Comment } from '@unschema-graph/astro';

// Svelte 5
import { Comment } from '@unschema-graph/svelte';

// Core / Node.js
import { Comment } from '@unschema-graph/core';
import { CommentSchema } from '@unschema-graph/core';
```

The `CommentSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  CommentSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type CommentInput = SchemaInput<typeof CommentSchema>;
type CommentOutput = SchemaOutput<typeof CommentSchema, 'Comment'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `text` | string | Yes | non-empty |
| `author` | [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | Yes | — |
| `datePublished` | string \| number \| Date | No | non-empty |
| `upvoteCount` | number | No | integer; minimum: -9007199254740991; maximum: 9007199254740991 |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Comment'`.

## Minimal example

```ts
import { Comment } from '@unschema-graph/core';

const entity = Comment({
  "text": "This pattern works well.",
  "author": "Grace Hopper"
});
```

## Output

```json
{
  "@type": "Comment",
  "text": "This pattern works well.",
  "author": {
    "@type": "Person",
    "name": "Grace Hopper"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Comment](https://schema.org/Comment)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Comment.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
