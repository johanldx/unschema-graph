---
title: Review builder
description: Reference for the Review builder and its validated Schema.org Review output.
---

Creates a Review with an author and rating. The `Review` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Review } from '@unschema-graph/astro';

// Svelte 5
import { Review } from '@unschema-graph/svelte';

// Core / Node.js
import { Review } from '@unschema-graph/core';
import { ReviewSchema } from '@unschema-graph/core';
```

The `ReviewSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ReviewSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ReviewInput = SchemaInput<typeof ReviewSchema>;
type ReviewOutput = SchemaOutput<typeof ReviewSchema, 'Review'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `author` | string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | Yes | non-empty |
| `reviewRating` | [Rating](/reference/builders/rating/) | Yes | — |
| `datePublished` | string \| number \| Date | No | non-empty |
| `reviewBody` | string | No | — |
| `name` | string | No | — |
| `itemReviewed` | string \| SchemaOrgEntity \| EntityReference | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Review'`.

## Minimal example

```ts
import { Review } from '@unschema-graph/core';

const entity = Review({
  "author": "Ada Lovelace",
  "reviewRating": {
    "ratingValue": 5
  },
  "reviewBody": "Clear and reliable."
});
```

## Output

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5,
    "bestRating": 5,
    "worstRating": 1
  },
  "reviewBody": "Clear and reliable."
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/)
- Used by: [E-commerce](/recipes/ecommerce/)
- External sources: [Schema.org Review](https://schema.org/Review)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Review.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
