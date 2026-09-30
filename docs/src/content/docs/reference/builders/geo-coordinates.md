---
title: GeoCoordinates builder
description: Reference for the GeoCoordinates builder and its validated Schema.org GeoCoordinates output.
---

Creates geographic coordinates from numbers or strings. The `GeoCoordinates` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { GeoCoordinates } from '@unschema-graph/astro';

// Svelte 5
import { GeoCoordinates } from '@unschema-graph/svelte';

// Core / Node.js
import { GeoCoordinates } from '@unschema-graph/core';
import { GeoCoordinatesSchema } from '@unschema-graph/core';
```

The `GeoCoordinatesSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  GeoCoordinatesSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type GeoCoordinatesInput = SchemaInput<typeof GeoCoordinatesSchema>;
type GeoCoordinatesOutput = SchemaOutput<typeof GeoCoordinatesSchema, 'GeoCoordinates'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `latitude` | number \| string | Yes | — |
| `longitude` | number \| string | Yes | — |
| `elevation` | number \| string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'GeoCoordinates'`.

## Minimal example

```ts
import { GeoCoordinates } from '@unschema-graph/core';

const entity = GeoCoordinates({
  "latitude": 48.8566,
  "longitude": 2.3522
});
```

## Output

```json
{
  "@type": "GeoCoordinates",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

## Relationships and recipes

- Related builders: [`ImageObject`](/reference/builders/image-object/), [`PostalAddress`](/reference/builders/postal-address/), [`ContactPoint`](/reference/builders/contact-point/)
- Used by: [Local business](/recipes/local-business/)
- External sources: [Schema.org GeoCoordinates](https://schema.org/GeoCoordinates)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `GeoCoordinates.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
