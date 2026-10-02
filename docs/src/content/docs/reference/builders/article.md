---
title: Article builder
description: Reference for the Article builder and its validated Schema.org Article output.
---

Creates a validated Schema.org Article without applying a consumer profile. The `Article` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Article } from '@unschema-graph/astro';

// Svelte 5
import { Article } from '@unschema-graph/svelte';

// Core / Node.js
import { Article } from '@unschema-graph/core';
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

type ArticleInput = SchemaInput<typeof ArticleSchema>;
type ArticleOutput = SchemaOutput<typeof ArticleSchema, 'Article'>;
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
validation configuration as its second argument and always returns `@type: 'Article'`.

## Minimal example

```ts
import { Article } from '@unschema-graph/core';

const entity = Article({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Output

```json
{
  "@type": "Article",
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

- Related builders: [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/), [`HowTo`](/reference/builders/how-to/)
- Used by: [Blog & media](/recipes/blog-media/), [CMS & Content Collections](/recipes/cms-content-collections/), [SvelteKit & SSR](/recipes/sveltekit-ssr/), [Audit in CI](/recipes/audit-ci/), [Core in any framework](/recipes/core-frameworks/)
- External sources: [Schema.org Article](https://schema.org/Article) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Article.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
