---
title: Custom Schemas
description: Create strict, typed Schema.org builders with Zod and defineSchema.
---

When your project requires Schema.org types not included in the built-in catalog (such as `PodcastEpisode`, `MedicalWebPage`, or `TechArticle`), use `defineSchema()` to construct your own custom builders with identical validation and `@graph` capabilities.

---

## 1. Creating a Custom Builder

Use `defineSchema()` by providing the Schema.org `@type` name and a Zod schema:

```ts title="src/lib/schemas/podcast.ts"
import { defineSchema } from '@unschema-graph/core';
import { z } from 'zod';

export const PodcastEpisode = defineSchema(
  'PodcastEpisode',
  z.object({
    name: z.string().min(1),
    url: z.string().url(),
    duration: z.string().optional(),
    partOfSeries: z.string().optional(),
  })
);
```

You can now use your custom builder exactly like any built-in builder:

```ts title="src/pages/podcast/[slug].astro"
import { PodcastEpisode } from '../../lib/schemas/podcast';

const episode = PodcastEpisode({
  '@id': '#episode-42',
  name: 'Building with Astro & unschema-graph',
  url: 'https://example.com/podcast/episode-42',
  duration: 'PT45M',
  partOfSeries: '#podcast-series',
});
```

Every custom builder automatically:
- Injects the Schema.org `@type` attribute (`"PodcastEpisode"`).
- Accepts an optional `@id` property.
- Rejects unknown top-level properties to prevent typos.
- Obeys global and per-call `onError` severity modes (`throw`, `warn`, `silent`).
- Exposes `.schema`, `.entityType`, and `.safeParse()`.

`defineSchema()` enforces `.strict()` on its top-level Zod object even if the supplied
object omitted it. Nested objects must still declare `.strict()` explicitly. Built-in
schemas follow the same policy; only `TypedEntitySchema` intentionally uses
`.passthrough()` as the extension point for custom typed entities in relationships.

---

## 2. Composing with Built-in Schemas

Every built-in schema is exported with the `*Schema` suffix (e.g. `PersonSchema`, `OrganizationSchema`, `ImageObjectSchema`, `IsoDateSchema`). You can nest them directly into your custom schemas:

```ts title="src/lib/schemas/podcast-series.ts"
import {
  defineSchema,
  PersonSchema,
  ImageObjectSchema,
} from '@unschema-graph/core';
import { z } from 'zod';

export const PodcastSeries = defineSchema(
  'PodcastSeries',
  z.object({
    name: z.string(),
    description: z.string(),
    author: PersonSchema,
    image: ImageObjectSchema.optional(),
  })
);
```

:::tip
Keep nested custom schemas strict. If you need dynamic, one-off properties on an entity,
use `withAdditionalProperties()` instead of weakening the Zod definition with `z.any()`
or `.passthrough()`. This escape hatch cannot replace `@type` or `@id`.
:::
