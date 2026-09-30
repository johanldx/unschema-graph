---
title: VideoObject builder
description: Reference for the VideoObject builder and its validated Schema.org VideoObject output.
---

Creates a VideoObject for video metadata and key moments. The `VideoObject` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { VideoObject } from '@unschema-graph/astro';

// Svelte 5
import { VideoObject } from '@unschema-graph/svelte';

// Core / Node.js
import { VideoObject } from '@unschema-graph/core';
import { VideoObjectSchema } from '@unschema-graph/core';
```

The `VideoObjectSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  VideoObjectSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type VideoObjectInput = SchemaInput<typeof VideoObjectSchema>;
type VideoObjectOutput = SchemaOutput<typeof VideoObjectSchema, 'VideoObject'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `description` | string | Yes | non-empty |
| `thumbnailUrl` | string \| Array<string> \| string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | Yes | non-empty |
| `uploadDate` | string \| number \| Date | Yes | non-empty |
| `duration` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `contentUrl` | string | No | — |
| `embedUrl` | string | No | — |
| `hasPart` | object \| Array<object> | No | — |
| `inLanguage` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'VideoObject'`.

## Minimal example

```ts
import { VideoObject } from '@unschema-graph/core';

const entity = VideoObject({
  "name": "Astro schema tutorial",
  "description": "Learn how to add JSON-LD to Astro.",
  "thumbnailUrl": "/images/video.jpg",
  "uploadDate": "2026-09-29"
});
```

## Output

```json
{
  "@type": "VideoObject",
  "name": "Astro schema tutorial",
  "description": "Learn how to add JSON-LD to Astro.",
  "thumbnailUrl": "/images/video.jpg",
  "uploadDate": "2026-09-29"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org VideoObject](https://schema.org/VideoObject)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `VideoObject.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
