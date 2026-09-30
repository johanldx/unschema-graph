---
title: Movie builder
description: Reference for the Movie builder and its validated Schema.org Movie output.
---

Creates a Movie with cast, media, rating, and review metadata. The `Movie` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Movie } from '@unschema-graph/astro';

// Svelte 5
import { Movie } from '@unschema-graph/svelte';

// Core / Node.js
import { Movie } from '@unschema-graph/core';
import { MovieSchema } from '@unschema-graph/core';
```

The `MovieSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  MovieSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type MovieInput = SchemaInput<typeof MovieSchema>;
type MovieOutput = SchemaOutput<typeof MovieSchema, 'Movie'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `director` | string \| object \| Array<string \| object> | No | — |
| `actor` | string \| object \| Array<string \| object> | No | — |
| `dateCreated` | string \| number \| Date | No | non-empty |
| `duration` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `trailer` | [VideoObject](/reference/builders/video-object/) | No | — |
| `description` | string | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |
| `review` | [Review](/reference/builders/review/) \| Array<[Review](/reference/builders/review/)> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Movie'`.

## Minimal example

```ts
import { Movie } from '@unschema-graph/core';

const entity = Movie({
  "name": "Journey to the Stars",
  "director": "Ada Lovelace"
});
```

## Output

```json
{
  "@type": "Movie",
  "name": "Journey to the Stars",
  "director": "Ada Lovelace"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Movie](https://schema.org/Movie)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Movie.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
