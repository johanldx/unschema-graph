---
title: JobPosting builder
description: Reference for the JobPosting builder and its validated Schema.org JobPosting output.
---

Creates a JobPosting following Google for Jobs conventions. The `JobPosting` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { JobPosting } from '@unschema-graph/astro';

// Svelte 5
import { JobPosting } from '@unschema-graph/svelte';

// Core / Node.js
import { JobPosting } from '@unschema-graph/core';
import { JobPostingSchema } from '@unschema-graph/core';
```

The `JobPostingSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  JobPostingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type JobPostingInput = SchemaInput<typeof JobPostingSchema>;
type JobPostingOutput = SchemaOutput<typeof JobPostingSchema, 'JobPosting'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `title` | string | Yes | non-empty |
| `description` | string | Yes | non-empty |
| `datePosted` | string \| number \| Date | Yes | non-empty |
| `hiringOrganization` | string \| [Organization](/reference/builders/organization/) \| EntityReference | Yes | non-empty |
| `jobLocation` | Place \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference \| string | No | — |
| `validThrough` | string \| number \| Date | No | non-empty |
| `employmentType` | string \| Array<string> | No | — |
| `jobLocationType` | string | No | — |
| `applicantLocationRequirements` | string \| object | No | — |
| `baseSalary` | object | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'JobPosting'`.

## Minimal example

```ts
import { JobPosting } from '@unschema-graph/core';

const entity = JobPosting({
  "title": "Astro developer",
  "description": "Build accessible content sites.",
  "datePosted": "2026-09-29",
  "hiringOrganization": "Acme"
});
```

## Output

```json
{
  "@type": "JobPosting",
  "title": "Astro developer",
  "description": "Build accessible content sites.",
  "datePosted": "2026-09-29",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme"
  }
}
```

## Relationships and recipes

- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Service`](/reference/builders/service/)
- Used by: no dedicated recipe
- External sources: [Schema.org JobPosting](https://schema.org/JobPosting)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `JobPosting.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
