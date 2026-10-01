---
title: WebApplication builder
description: Reference for the WebApplication builder and its validated Schema.org WebApplication output.
---

Creates a WebApplication using the software application schema. The `WebApplication` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebApplication } from '@unschema-graph/astro';

// Svelte 5
import { WebApplication } from '@unschema-graph/svelte';

// Core / Node.js
import { WebApplication } from '@unschema-graph/core';
import { SoftwareApplicationSchema } from '@unschema-graph/core';
```

The `SoftwareApplicationSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  SoftwareApplicationSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebApplicationInput = SchemaInput<typeof SoftwareApplicationSchema>;
type WebApplicationOutput = SchemaOutput<typeof SoftwareApplicationSchema, 'WebApplication'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `operatingSystem` | string | No | — |
| `applicationCategory` | string | No | — |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |
| `review` | [Review](/reference/builders/review/) \| Array<[Review](/reference/builders/review/)> | No | — |
| `screenshot` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `softwareVersion` | string | No | — |
| `downloadUrl` | string | No | non-empty |
| `fileSize` | string | No | — |
| `description` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'WebApplication'`.

## Minimal example

```ts
import { WebApplication } from '@unschema-graph/core';

const entity = WebApplication({
  "name": "Acme Editor",
  "operatingSystem": "Web",
  "applicationCategory": "DeveloperApplication"
});
```

## Output

```json
{
  "@type": "WebApplication",
  "name": "Acme Editor",
  "operatingSystem": "Web",
  "applicationCategory": "DeveloperApplication"
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/)
- Used by: no dedicated recipe
- External sources: [Schema.org WebApplication](https://schema.org/WebApplication)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `WebApplication.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
