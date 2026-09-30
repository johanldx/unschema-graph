---
title: Dataset builder
description: Reference for the Dataset builder and its validated Schema.org Dataset output.
---

Creates a Dataset following Google dataset metadata conventions. The `Dataset` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Dataset } from '@unschema-graph/astro';

// Svelte 5
import { Dataset } from '@unschema-graph/svelte';

// Core / Node.js
import { Dataset } from '@unschema-graph/core';
import { DatasetSchema } from '@unschema-graph/core';
```

The `DatasetSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  DatasetSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type DatasetInput = SchemaInput<typeof DatasetSchema>;
type DatasetOutput = SchemaOutput<typeof DatasetSchema, 'Dataset'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `description` | string | Yes | non-empty |
| `url` | string | No | — |
| `creator` | string \| object \| Array<string \| object> | No | — |
| `distribution` | [DataDownload](/reference/builders/data-download/) \| Array<[DataDownload](/reference/builders/data-download/)> | No | — |
| `license` | string | No | — |
| `keywords` | string \| Array<string> | No | — |
| `temporalCoverage` | string | No | — |
| `spatialCoverage` | string | No | — |
| `version` | string | No | — |
| `isAccessibleForFree` | boolean | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Dataset'`.

## Minimal example

```ts
import { Dataset } from '@unschema-graph/core';

const entity = Dataset({
  "name": "Astro adoption data",
  "description": "Annual anonymized adoption metrics."
});
```

## Output

```json
{
  "@type": "Dataset",
  "name": "Astro adoption data",
  "description": "Annual anonymized adoption metrics."
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: no dedicated recipe
- External sources: [Schema.org Dataset](https://schema.org/Dataset)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Dataset.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
