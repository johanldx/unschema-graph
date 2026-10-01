---
title: DataDownload builder
description: Reference for the DataDownload builder and its validated Schema.org DataDownload output.
---

Creates a downloadable distribution for a Dataset. The `DataDownload` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { DataDownload } from '@unschema-graph/astro';

// Svelte 5
import { DataDownload } from '@unschema-graph/svelte';

// Core / Node.js
import { DataDownload } from '@unschema-graph/core';
import { DataDownloadSchema } from '@unschema-graph/core';
```

The `DataDownloadSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  DataDownloadSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DataDownloadInput = SchemaInput<typeof DataDownloadSchema>;
type DataDownloadOutput = SchemaOutput<typeof DataDownloadSchema, 'DataDownload'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `contentUrl` | string | Yes | non-empty |
| `encodingFormat` | string | No | — |
| `name` | string | No | — |
| `description` | string | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'DataDownload'`.

## Minimal example

```ts
import { DataDownload } from '@unschema-graph/core';

const entity = DataDownload({
  "contentUrl": "https://example.com/data.csv",
  "encodingFormat": "text/csv"
});
```

## Output

```json
{
  "@type": "DataDownload",
  "contentUrl": "https://example.com/data.csv",
  "encodingFormat": "text/csv"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org DataDownload](https://schema.org/DataDownload)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `DataDownload.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
