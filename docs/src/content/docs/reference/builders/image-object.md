---
title: ImageObject builder
description: Reference for the ImageObject builder and its validated Schema.org ImageObject output.
---

Creates an ImageObject from an absolute or root-relative URL. The `ImageObject` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { ImageObject } from '@unschema-graph/astro';

// Svelte 5
import { ImageObject } from '@unschema-graph/svelte';

// Core / Node.js
import { ImageObject } from '@unschema-graph/core';
import { ImageObjectSchema } from '@unschema-graph/core';
```

The `ImageObjectSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ImageObjectSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ImageObjectInput = SchemaInput<typeof ImageObjectSchema>;
type ImageObjectOutput = SchemaOutput<typeof ImageObjectSchema, 'ImageObject'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `url` | string | Yes | non-empty |
| `contentUrl` | string | No | non-empty |
| `caption` | string | No | — |
| `description` | string | No | — |
| `width` | number \| string | No | — |
| `height` | number \| string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'ImageObject'`.

## Minimal example

```ts
import { ImageObject } from '@unschema-graph/core';

const entity = ImageObject({
  "url": "/images/cover.jpg",
  "caption": "Article cover"
});
```

## Output

```json
{
  "@type": "ImageObject",
  "url": "/images/cover.jpg",
  "caption": "Article cover"
}
```

## Relationships and recipes

- Related builders: [`PostalAddress`](/reference/builders/postal-address/), [`GeoCoordinates`](/reference/builders/geo-coordinates/), [`ContactPoint`](/reference/builders/contact-point/)
- Used by: [Blog & media](/recipes/blog-media/)
- External sources: [Schema.org ImageObject](https://schema.org/ImageObject)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `ImageObject.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
