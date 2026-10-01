---
title: Rating builder
description: Reference for the Rating builder and its validated Schema.org Rating output.
---

Creates a Rating with default best and worst values. The `Rating` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Rating } from '@unschema-graph/astro';

// Svelte 5
import { Rating } from '@unschema-graph/svelte';

// Core / Node.js
import { Rating } from '@unschema-graph/core';
import { RatingSchema } from '@unschema-graph/core';
```

The `RatingSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  RatingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type RatingInput = SchemaInput<typeof RatingSchema>;
type RatingOutput = SchemaOutput<typeof RatingSchema, 'Rating'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `ratingValue` | number \| string | Yes | — |
| `bestRating` | number \| string | No | default: 5 |
| `worstRating` | number \| string | No | default: 1 |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Rating'`.

## Minimal example

```ts
import { Rating } from '@unschema-graph/core';

const entity = Rating({
  "ratingValue": 4.5
});
```

## Output

```json
{
  "@type": "Rating",
  "ratingValue": 4.5,
  "bestRating": 5,
  "worstRating": 1
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/)
- Used by: no dedicated recipe
- External sources: [Schema.org Rating](https://schema.org/Rating)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Rating.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
