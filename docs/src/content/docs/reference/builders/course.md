---
title: Course builder
description: Reference for the Course builder and its validated Schema.org Course output.
---

Creates a Course with a provider entity or reference. The `Course` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Course } from '@unschema-graph/astro';

// Svelte 5
import { Course } from '@unschema-graph/svelte';

// Core / Node.js
import { Course } from '@unschema-graph/core';
import { CourseSchema } from '@unschema-graph/core';
```

The `CourseSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  CourseSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type CourseInput = SchemaInput<typeof CourseSchema>;
type CourseOutput = SchemaOutput<typeof CourseSchema, 'Course'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `description` | string | Yes | non-empty |
| `provider` | unknown | Yes | — |
| `courseCode` | string | No | — |
| `educationalCredentialAwarded` | string | No | — |
| `inLanguage` | string | No | — |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Course'`.

## Minimal example

```ts
import { Course } from '@unschema-graph/core';

const entity = Course({
  "name": "Astro fundamentals",
  "description": "Build content-driven sites with Astro.",
  "provider": "Acme Academy"
});
```

## Output

```json
{
  "@type": "Course",
  "name": "Astro fundamentals",
  "description": "Build content-driven sites with Astro.",
  "provider": {
    "@type": "Organization",
    "name": "Acme Academy"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Course](https://schema.org/Course)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Course.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
