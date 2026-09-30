---
title: ProfilePage builder
description: Reference for the ProfilePage builder and its validated Schema.org ProfilePage output.
---

Creates a ProfilePage for a Person or Organization. The `ProfilePage` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { ProfilePage } from '@unschema-graph/astro';

// Svelte 5
import { ProfilePage } from '@unschema-graph/svelte';

// Core / Node.js
import { ProfilePage } from '@unschema-graph/core';
import { ProfilePageSchema } from '@unschema-graph/core';
```

The `ProfilePageSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  ProfilePageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ProfilePageInput = SchemaInput<typeof ProfilePageSchema>;
type ProfilePageOutput = SchemaOutput<typeof ProfilePageSchema, 'ProfilePage'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `mainEntity` | object | Yes | — |
| `name` | string | No | — |
| `url` | string | No | — |
| `description` | string | No | — |
| `dateCreated` | string \| number \| Date | No | non-empty |
| `dateModified` | string \| number \| Date | No | non-empty |
| `inLanguage` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'ProfilePage'`.

## Minimal example

```ts
import { ProfilePage } from '@unschema-graph/core';

const entity = ProfilePage({
  "mainEntity": {
    "name": "Ada Lovelace"
  }
});
```

## Output

```json
{
  "@type": "ProfilePage",
  "mainEntity": {
    "name": "Ada Lovelace"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org ProfilePage](https://schema.org/ProfilePage)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `ProfilePage.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
