---
title: ContactPoint builder
description: Reference for the ContactPoint builder and its validated Schema.org ContactPoint output.
---

Creates reusable contact metadata for a person or organization. The `ContactPoint` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { ContactPoint } from '@unschema-graph/astro';

// Svelte 5
import { ContactPoint } from '@unschema-graph/svelte';

// Core / Node.js
import { ContactPoint } from '@unschema-graph/core';
import { ContactPointSchema } from '@unschema-graph/core';
```

The `ContactPointSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ContactPointSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ContactPointInput = SchemaInput<typeof ContactPointSchema>;
type ContactPointOutput = SchemaOutput<typeof ContactPointSchema, 'ContactPoint'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `telephone` | string | No | — |
| `contactType` | string | No | — |
| `email` | string | No | format: email |
| `areaServed` | string \| Array<string> | No | — |
| `availableLanguage` | string \| Array<string> | No | — |
| `url` | string | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'ContactPoint'`.

## Minimal example

```ts
import { ContactPoint } from '@unschema-graph/core';

const entity = ContactPoint({
  "contactType": "customer support",
  "email": "support@example.com"
});
```

## Output

```json
{
  "@type": "ContactPoint",
  "contactType": "customer support",
  "email": "support@example.com"
}
```

## Relationships and recipes

- Related builders: [`ImageObject`](/reference/builders/image-object/), [`PostalAddress`](/reference/builders/postal-address/), [`GeoCoordinates`](/reference/builders/geo-coordinates/)
- Used by: no dedicated recipe
- External sources: [Schema.org ContactPoint](https://schema.org/ContactPoint)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `ContactPoint.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
