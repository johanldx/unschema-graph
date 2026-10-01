---
title: DiscussionForumPosting builder
description: Reference for the DiscussionForumPosting builder and its validated Schema.org DiscussionForumPosting output.
---

Creates a DiscussionForumPosting with author and comment metadata. The `DiscussionForumPosting` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { DiscussionForumPosting } from '@unschema-graph/astro';

// Svelte 5
import { DiscussionForumPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { DiscussionForumPosting } from '@unschema-graph/core';
import { DiscussionForumPostingSchema } from '@unschema-graph/core';
```

The `DiscussionForumPostingSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  DiscussionForumPostingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DiscussionForumPostingInput = SchemaInput<typeof DiscussionForumPostingSchema>;
type DiscussionForumPostingOutput = SchemaOutput<typeof DiscussionForumPostingSchema, 'DiscussionForumPosting'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `headline` | string | Yes | non-empty |
| `author` | [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | Yes | — |
| `datePublished` | string \| number \| Date | Yes | non-empty |
| `text` | string | No | — |
| `comment` | object \| Array<object> | No | — |
| `url` | string | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'DiscussionForumPosting'`.

## Minimal example

```ts
import { DiscussionForumPosting } from '@unschema-graph/core';

const entity = DiscussionForumPosting({
  "headline": "Structured data patterns",
  "author": "Ada Lovelace",
  "datePublished": "2026-09-29"
});
```

## Output

```json
{
  "@type": "DiscussionForumPosting",
  "headline": "Structured data patterns",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  },
  "datePublished": "2026-09-29"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org DiscussionForumPosting](https://schema.org/DiscussionForumPosting)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `DiscussionForumPosting.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
