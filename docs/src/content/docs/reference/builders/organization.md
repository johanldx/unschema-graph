---
title: Organization builder
description: Reference for the Organization builder and its validated Schema.org Organization output.
---

Creates an Organization for publishers, providers, and brands. The `Organization` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Organization } from '@unschema-graph/astro';

// Svelte 5
import { Organization } from '@unschema-graph/svelte';

// Core / Node.js
import { Organization } from '@unschema-graph/core';
import { OrganizationSchema } from '@unschema-graph/core';
```

The `OrganizationSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  OrganizationSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type OrganizationInput = SchemaInput<typeof OrganizationSchema>;
type OrganizationOutput = SchemaOutput<typeof OrganizationSchema, 'Organization'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `legalName` | string | No | — |
| `url` | string | No | non-empty |
| `logo` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `description` | string | No | — |
| `sameAs` | string \| Array<string> | No | non-empty |
| `address` | string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference | No | non-empty |
| `contactPoint` | [ContactPoint](/reference/builders/contact-point/) \| Array<[ContactPoint](/reference/builders/contact-point/)> | No | — |
| `email` | string | No | format: email |
| `telephone` | string | No | — |
| `foundingDate` | string \| number \| Date | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Organization'`.

## Minimal example

```ts
import { Organization } from '@unschema-graph/core';

const entity = Organization({
  "name": "Acme",
  "url": "https://example.com"
});
```

## Output

```json
{
  "@type": "Organization",
  "name": "Acme",
  "url": "https://example.com"
}
```

## Relationships and recipes

- Related builders: [`Person`](/reference/builders/person/), [`LocalBusiness`](/reference/builders/local-business/), [`Restaurant`](/reference/builders/restaurant/), [`Store`](/reference/builders/store/)
- Used by: [Blog & media](/recipes/blog-media/), [Company site](/recipes/company-site/), [SvelteKit & SSR](/recipes/sveltekit-ssr/), [Core in any framework](/recipes/core-frameworks/)
- External sources: [Schema.org Organization](https://schema.org/Organization)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Organization.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
