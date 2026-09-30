---
title: AggregateOffer builder
description: Reference for the AggregateOffer builder and its validated Schema.org AggregateOffer output.
---

Creates an AggregateOffer describing a price range. The `AggregateOffer` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { AggregateOffer } from '@unschema-graph/astro';

// Svelte 5
import { AggregateOffer } from '@unschema-graph/svelte';

// Core / Node.js
import { AggregateOffer } from '@unschema-graph/core';
import { AggregateOfferSchema } from '@unschema-graph/core';
```

The `AggregateOfferSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  AggregateOfferSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AggregateOfferInput = SchemaInput<typeof AggregateOfferSchema>;
type AggregateOfferOutput = SchemaOutput<typeof AggregateOfferSchema, 'AggregateOffer'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `lowPrice` | number \| string | Yes | — |
| `highPrice` | number \| string | No | — |
| `priceCurrency` | string | Yes | minimum length: 3; maximum length: 3 |
| `offerCount` | number \| string | No | — |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'AggregateOffer'`.

## Minimal example

```ts
import { AggregateOffer } from '@unschema-graph/core';

const entity = AggregateOffer({
  "lowPrice": 79,
  "highPrice": 129,
  "priceCurrency": "EUR",
  "offerCount": 3
});
```

## Output

```json
{
  "@type": "AggregateOffer",
  "lowPrice": 79,
  "highPrice": 129,
  "priceCurrency": "EUR",
  "offerCount": 3
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`Service`](/reference/builders/service/), [`JobPosting`](/reference/builders/job-posting/)
- Used by: [E-commerce](/recipes/ecommerce/)
- External sources: [Schema.org AggregateOffer](https://schema.org/AggregateOffer)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `AggregateOffer.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
