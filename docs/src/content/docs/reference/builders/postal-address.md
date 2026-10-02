---
title: PostalAddress builder
description: Reference for the PostalAddress builder and its validated Schema.org PostalAddress output.
---

Creates a reusable PostalAddress structure. The `PostalAddress` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { PostalAddress } from '@unschema-graph/astro';

// Svelte 5
import { PostalAddress } from '@unschema-graph/svelte';

// Core / Node.js
import { PostalAddress } from '@unschema-graph/core';
import { PostalAddressSchema } from '@unschema-graph/core';
```

The `PostalAddressSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  PostalAddressSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type PostalAddressInput = SchemaInput<typeof PostalAddressSchema>;
type PostalAddressOutput = SchemaOutput<typeof PostalAddressSchema, 'PostalAddress'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `streetAddress` | string | No | — |
| `addressLocality` | string | No | — |
| `addressRegion` | string | No | — |
| `postalCode` | string | No | — |
| `addressCountry` | string | No | — |
| `postOfficeBoxNumber` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'PostalAddress'`.

## Minimal example

```ts
import { PostalAddress } from '@unschema-graph/core';

const entity = PostalAddress({
  "streetAddress": "1 Rue de Rivoli",
  "addressLocality": "Paris",
  "postalCode": "75001",
  "addressCountry": "FR"
});
```

## Output

```json
{
  "@type": "PostalAddress",
  "streetAddress": "1 Rue de Rivoli",
  "addressLocality": "Paris",
  "postalCode": "75001",
  "addressCountry": "FR"
}
```

## Relationships and recipes

- Related builders: [`ImageObject`](/reference/builders/image-object/), [`GeoCoordinates`](/reference/builders/geo-coordinates/), [`ContactPoint`](/reference/builders/contact-point/)
- Used by: [Local business](/recipes/local-business/), [Events](/recipes/events/)
- External sources: [Schema.org PostalAddress](https://schema.org/PostalAddress)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `PostalAddress.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
