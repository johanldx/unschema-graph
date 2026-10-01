---
title: AggregateRating builder
description: Reference for the AggregateRating builder and its validated Schema.org AggregateRating output.
---

Creates an AggregateRating with aggregate count metadata. The `AggregateRating` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { AggregateRating } from '@unschema-graph/astro';

// Svelte 5
import { AggregateRating } from '@unschema-graph/svelte';

// Core / Node.js
import { AggregateRating } from '@unschema-graph/core';
import { AggregateRatingSchema } from '@unschema-graph/core';
```

The `AggregateRatingSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  AggregateRatingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AggregateRatingInput = SchemaInput<typeof AggregateRatingSchema>;
type AggregateRatingOutput = SchemaOutput<typeof AggregateRatingSchema, 'AggregateRating'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `ratingValue` | number \| string | Yes | — |
| `bestRating` | number \| string | No | default: 5 |
| `worstRating` | number \| string | No | default: 1 |
| `ratingCount` | number | No | integer; minimum: 0; maximum: 9007199254740991 |
| `reviewCount` | number | No | integer; minimum: 0; maximum: 9007199254740991 |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'AggregateRating'`.

## Minimal example

```ts
import { AggregateRating } from '@unschema-graph/core';

const entity = AggregateRating({
  "ratingValue": 4.8,
  "ratingCount": 125
});
```

## Output

```json
{
  "@type": "AggregateRating",
  "ratingValue": 4.8,
  "bestRating": 5,
  "worstRating": 1,
  "ratingCount": 125
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/)
- Used by: [E-commerce](/recipes/ecommerce/)
- External sources: [Schema.org AggregateRating](https://schema.org/AggregateRating)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `AggregateRating.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
