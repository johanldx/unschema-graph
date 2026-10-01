---
title: Person builder
description: Reference for the Person builder and its validated Schema.org Person output.
---

Creates a Person for authors, performers, and other identities. The `Person` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Person } from '@unschema-graph/astro';

// Svelte 5
import { Person } from '@unschema-graph/svelte';

// Core / Node.js
import { Person } from '@unschema-graph/core';
import { PersonSchema } from '@unschema-graph/core';
```

The `PersonSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  PersonSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type PersonInput = SchemaInput<typeof PersonSchema>;
type PersonOutput = SchemaOutput<typeof PersonSchema, 'Person'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | — |
| `name` | string | Yes | non-empty |
| `givenName` | string | No | — |
| `familyName` | string | No | — |
| `additionalName` | string | No | — |
| `url` | string | No | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) | No | non-empty |
| `jobTitle` | string | No | — |
| `worksFor` | unknown | No | — |
| `sameAs` | string \| Array<string> | No | non-empty |
| `email` | string | No | format: email |
| `telephone` | string | No | — |
| `description` | string | No | — |
| `address` | string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/reference/builders/postal-address/) \| EntityReference | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Person'`.

## Minimal example

```ts
import { Person } from '@unschema-graph/core';

const entity = Person({
  "name": "Ada Lovelace",
  "jobTitle": "Engineer"
});
```

## Output

```json
{
  "@type": "Person",
  "name": "Ada Lovelace",
  "jobTitle": "Engineer"
}
```

## Relationships and recipes

- Related builders: [`Organization`](/reference/builders/organization/), [`LocalBusiness`](/reference/builders/local-business/), [`Restaurant`](/reference/builders/restaurant/), [`Store`](/reference/builders/store/)
- Used by: [Blog & media](/recipes/blog-media/)
- External sources: [Schema.org Person](https://schema.org/Person)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Person.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
