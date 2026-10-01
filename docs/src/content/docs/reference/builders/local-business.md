---
title: LocalBusiness builder
description: Reference for the LocalBusiness builder and its validated Schema.org LocalBusiness output.
---

Creates a LocalBusiness with physical location metadata. The `LocalBusiness` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { LocalBusiness } from '@unschema-graph/astro';

// Svelte 5
import { LocalBusiness } from '@unschema-graph/svelte';

// Core / Node.js
import { LocalBusiness } from '@unschema-graph/core';
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

type LocalBusinessInput = SchemaInput<typeof LocalBusinessSchema>;
type LocalBusinessOutput = SchemaOutput<typeof LocalBusinessSchema, 'LocalBusiness'>;
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
| `servesCuisine` | string \| Array<string> | No | — |
| `menu` | string | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'LocalBusiness'`.

## Minimal example

```ts
import { LocalBusiness } from '@unschema-graph/core';

const entity = LocalBusiness({
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
  "@type": "LocalBusiness",
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

- Related builders: [`Organization`](/reference/builders/organization/), [`Person`](/reference/builders/person/), [`Restaurant`](/reference/builders/restaurant/), [`Store`](/reference/builders/store/)
- Used by: [Local business](/recipes/local-business/)
- External sources: [Schema.org LocalBusiness](https://schema.org/LocalBusiness) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `LocalBusiness.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
