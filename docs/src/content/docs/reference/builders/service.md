---
title: Service builder
description: Reference for the Service builder and its validated Schema.org Service output.
---

Creates a Service with provider, coverage, offer, and review metadata. The `Service` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Service } from '@unschema-graph/astro';

// Svelte 5
import { Service } from '@unschema-graph/svelte';

// Core / Node.js
import { Service } from '@unschema-graph/core';
import { ServiceSchema } from '@unschema-graph/core';
```

The `ServiceSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ServiceSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ServiceInput = SchemaInput<typeof ServiceSchema>;
type ServiceOutput = SchemaOutput<typeof ServiceSchema, 'Service'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `provider` | string \| [Person](/reference/builders/person/) \| [Organization](/reference/builders/organization/) \| [LocalBusiness](/reference/builders/local-business/) \| EntityReference | No | non-empty |
| `serviceType` | string | No | — |
| `description` | string | No | — |
| `areaServed` | string \| Array<string> \| object | No | — |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |
| `review` | [Review](/reference/builders/review/) \| Array<[Review](/reference/builders/review/)> | No | — |
| `termsOfService` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Service'`.

## Minimal example

```ts
import { Service } from '@unschema-graph/core';

const entity = Service({
  "name": "Astro consulting",
  "provider": "Acme"
});
```

## Output

```json
{
  "@type": "Service",
  "name": "Astro consulting",
  "provider": {
    "@type": "Organization",
    "name": "Acme"
  }
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`JobPosting`](/reference/builders/job-posting/)
- Used by: no dedicated recipe
- External sources: [Schema.org Service](https://schema.org/Service)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Service.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
