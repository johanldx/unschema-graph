---
title: Store builder
description: Reference for the Store builder and its validated Schema.org Store output.
---

Creates a Store using the LocalBusiness schema. The `Store` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Store } from '@unschema-graph/astro';

// Svelte 5
import { Store } from '@unschema-graph/svelte';

// Core / Node.js
import { Store } from '@unschema-graph/core';
import { LocalBusinessSchema } from '@unschema-graph/core';
```

The `LocalBusinessSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  LocalBusinessSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type StoreInput = SchemaInput<typeof LocalBusinessSchema>;
type StoreOutput = SchemaOutput<typeof LocalBusinessSchema, 'Store'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `address` | string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference | Yes | — |
| `image` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `telephone` | string | No | — |
| `priceRange` | string | No | — |
| `url` | string | No | — |
| `geo` | [GeoCoordinates](/reference/builders/geo-coordinates/) | No | — |
| `openingHoursSpecification` | object \| Array<object> | No | — |
| `currenciesAccepted` | string | No | — |
| `paymentAccepted` | string | No | — |
| `sameAs` | string \| Array<string> | No | — |
| `servesCuisine` | string \| Array<string> | No | — |
| `menu` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Store'`.

## Minimal example

```ts
import { Store } from '@unschema-graph/core';

const entity = Store({
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
});
```

## Output

```json
{
  "@type": "Store",
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
}
```

## Relationships and recipes

- Related builders: [`Organization`](/reference/builders/organization/), [`Person`](/reference/builders/person/), [`LocalBusiness`](/reference/builders/local-business/), [`Restaurant`](/reference/builders/restaurant/)
- Used by: no dedicated recipe
- External sources: [Schema.org Store](https://schema.org/Store)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Store.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
