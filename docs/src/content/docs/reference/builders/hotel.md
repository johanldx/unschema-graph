---
title: Hotel builder
description: Reference for the Hotel builder and its validated Schema.org Hotel output.
---

Creates a Hotel using the lodging schema. The `Hotel` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Hotel } from '@unschema-graph/astro';

// Svelte 5
import { Hotel } from '@unschema-graph/svelte';

// Core / Node.js
import { Hotel } from '@unschema-graph/core';
import { LodgingBusinessSchema } from '@unschema-graph/core';
```

The `LodgingBusinessSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  LodgingBusinessSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HotelInput = SchemaInput<typeof LodgingBusinessSchema>;
type HotelOutput = SchemaOutput<typeof LodgingBusinessSchema, 'Hotel'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `address` | string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference | Yes | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `telephone` | string | No | — |
| `priceRange` | string | No | — |
| `url` | string | No | non-empty |
| `geo` | [GeoCoordinates](/reference/builders/geo-coordinates/) \| string \| [GeoCoordinates](/reference/builders/geo-coordinates/) | No | non-empty |
| `openingHoursSpecification` | object \| Array<object> | No | — |
| `currenciesAccepted` | string | No | — |
| `paymentAccepted` | string | No | — |
| `sameAs` | string \| Array<string> | No | non-empty |
| `checkinTime` | string | No | — |
| `checkoutTime` | string | No | — |
| `numberOfRooms` | number | No | integer; greater than 0; maximum: 9007199254740991 |
| `petsAllowed` | boolean \| string | No | — |
| `amenityFeature` | string \| Array<string> \| string \| object \| Array<string \| object> | No | non-empty |
| `starRating` | object | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Hotel'`.

## Minimal example

```ts
import { Hotel } from '@unschema-graph/core';

const entity = Hotel({
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
  "@type": "Hotel",
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
- External sources: [Schema.org Hotel](https://schema.org/Hotel)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Hotel.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
