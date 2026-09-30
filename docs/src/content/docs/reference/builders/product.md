---
title: Product builder
description: Reference for the Product builder and its validated Schema.org Product output.
---

Creates Product metadata with offers, ratings, reviews, and identifiers. The `Product` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Product } from '@unschema-graph/astro';

// Svelte 5
import { Product } from '@unschema-graph/svelte';

// Core / Node.js
import { Product } from '@unschema-graph/core';
import { ProductSchema } from '@unschema-graph/core';
```

The `ProductSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ProductSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ProductInput = SchemaInput<typeof ProductSchema>;
type ProductOutput = SchemaOutput<typeof ProductSchema, 'Product'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `description` | string | No | — |
| `brand` | string \| Brand \| [Organization](/reference/builders/organization/) \| EntityReference | No | non-empty |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |
| `review` | [Review](/reference/builders/review/) \| Array<[Review](/reference/builders/review/)> | No | — |
| `sku` | string | No | — |
| `gtin` | string | No | — |
| `gtin8` | string | No | — |
| `gtin13` | string | No | — |
| `gtin14` | string | No | — |
| `mpn` | string | No | — |
| `category` | string | No | — |
| `color` | string | No | — |
| `material` | string | No | — |
| `releaseDate` | string \| number | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Product'`.

## Minimal example

```ts
import { Product } from '@unschema-graph/core';

const entity = Product({
  "name": "Mechanical keyboard",
  "sku": "KB-001",
  "brand": "Acme"
});
```

## Output

```json
{
  "@type": "Product",
  "name": "Mechanical keyboard",
  "brand": {
    "@type": "Brand",
    "name": "Acme"
  },
  "sku": "KB-001"
}
```

## Relationships and recipes

- Related builders: [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/), [`JobPosting`](/reference/builders/job-posting/)
- Used by: [E-commerce](/recipes/ecommerce/)
- External sources: [Schema.org Product](https://schema.org/Product) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/product)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Product.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
