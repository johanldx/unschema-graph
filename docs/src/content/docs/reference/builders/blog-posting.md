---
title: BlogPosting builder
description: Reference for the BlogPosting builder and its validated Schema.org BlogPosting output.
---

Creates a BlogPosting using the generic Article input schema. The `BlogPosting` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { BlogPosting } from '@unschema-graph/astro';

// Svelte 5
import { BlogPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { BlogPosting } from '@unschema-graph/core';
import { ArticleSchema } from '@unschema-graph/core';
```

The `ArticleSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ArticleSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BlogPostingInput = SchemaInput<typeof ArticleSchema>;
type BlogPostingOutput = SchemaOutput<typeof ArticleSchema, 'BlogPosting'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `headline` | string | No | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `datePublished` | string \| number \| Date | No | non-empty |
| `dateModified` | string \| number \| Date | No | non-empty |
| `author` | [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference \| Array<[Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference> | No | — |
| `publisher` | [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | No | — |
| `description` | string | No | — |
| `articleBody` | string | No | — |
| `articleSection` | string \| Array<string> | No | — |
| `keywords` | string \| Array<string> | No | — |
| `inLanguage` | string | No | — |
| `mainEntityOfPage` | string \| object | No | non-empty |
| `wordCount` | number | No | integer; greater than 0; maximum: 9007199254740991 |
| `speakable` | string \| Array<string> \| object | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'BlogPosting'`.

## Minimal example

```ts
import { BlogPosting } from '@unschema-graph/core';

const entity = BlogPosting({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Output

```json
{
  "@type": "BlogPosting",
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/), [`HowTo`](/reference/builders/how-to/)
- Used by: [Blog & media](/recipes/blog-media/)
- External sources: [Schema.org BlogPosting](https://schema.org/BlogPosting) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `BlogPosting.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
