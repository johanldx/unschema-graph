---
title: Offer builder
description: Reference for the Offer builder and its validated Schema.org Offer output.
---

Creates a single Offer with validated currency metadata. The `Offer` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Offer } from '@unschema-graph/astro';

// Svelte 5
import { Offer } from '@unschema-graph/svelte';

// Core / Node.js
import { Offer } from '@unschema-graph/core';
import { OfferSchema } from '@unschema-graph/core';
```

The `OfferSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  OfferSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type OfferInput = SchemaInput<typeof OfferSchema>;
type OfferOutput = SchemaOutput<typeof OfferSchema, 'Offer'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `price` | number \| string | Yes | — |
| `priceCurrency` | string | Yes | minimum length: 3; maximum length: 3 |
| `availability` | string | No | — |
| `url` | string | No | — |
| `priceValidUntil` | string \| number \| Date | No | non-empty |
| `itemCondition` | string | No | — |
| `seller` | string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| EntityReference | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Offer'`.

## Minimal example

```ts
import { Offer } from '@unschema-graph/core';

const entity = Offer({
  "price": 99,
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock"
});
```

## Output

```json
{
  "@type": "Offer",
  "price": 99,
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock"
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/), [`JobPosting`](/reference/builders/job-posting/)
- Used by: [E-commerce](/recipes/ecommerce/), [Events](/recipes/events/)
- External sources: [Schema.org Offer](https://schema.org/Offer)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Offer.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
