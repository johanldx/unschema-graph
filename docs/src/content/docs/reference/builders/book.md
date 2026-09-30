---
title: Book builder
description: Reference for the Book builder and its validated Schema.org Book output.
---

Creates a Book with author, publication, rating, and review metadata. The `Book` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Book } from '@unschema-graph/astro';

// Svelte 5
import { Book } from '@unschema-graph/svelte';

// Core / Node.js
import { Book } from '@unschema-graph/core';
import { BookSchema } from '@unschema-graph/core';
```

The `BookSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  BookSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BookInput = SchemaInput<typeof BookSchema>;
type BookOutput = SchemaOutput<typeof BookSchema, 'Book'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `author` | string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference \| Array<string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference> | Yes | — |
| `isbn` | string | No | — |
| `bookFormat` | string | No | — |
| `datePublished` | string \| number \| Date | No | non-empty |
| `publisher` | string \| [Organization](/reference/builders/organization/) \| EntityReference | No | — |
| `inLanguage` | string | No | — |
| `numberOfPages` | number | No | integer; greater than 0; maximum: 9007199254740991 |
| `description` | string | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |
| `review` | [Review](/reference/builders/review/) \| Array<[Review](/reference/builders/review/)> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Book'`.

## Minimal example

```ts
import { Book } from '@unschema-graph/core';

const entity = Book({
  "name": "The Astro Handbook",
  "author": "Ada Lovelace"
});
```

## Output

```json
{
  "@type": "Book",
  "name": "The Astro Handbook",
  "author": "Ada Lovelace"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Book](https://schema.org/Book)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Book.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
