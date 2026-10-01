---
title: WebSite builder
description: Reference for the WebSite builder and its validated Schema.org WebSite output.
---

Creates a WebSite and can generate a SearchAction from searchUrl. The `WebSite` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { WebSite } from '@unschema-graph/astro';

// Svelte 5
import { WebSite } from '@unschema-graph/svelte';

// Core / Node.js
import { WebSite } from '@unschema-graph/core';
import { WebSiteSchema } from '@unschema-graph/core';
```

The `WebSiteSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  WebSiteSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type WebSiteInput = SchemaInput<typeof WebSiteSchema>;
type WebSiteOutput = SchemaOutput<typeof WebSiteSchema, 'WebSite'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `url` | string | Yes | non-empty |
| `alternateName` | string \| Array<string> | No | — |
| `description` | string | No | — |
| `inLanguage` | string | No | — |
| `searchUrl` | string | No | non-empty |
| `publisher` | unknown | No | — |
| `potentialAction` | string \| object \| Array<string \| object> | No | non-empty |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'WebSite'`.

## Minimal example

```ts
import { WebSite } from '@unschema-graph/core';

const entity = WebSite({
  "name": "Acme Docs",
  "url": "https://example.com",
  "searchUrl": "https://example.com/search?q={search_term_string}"
});
```

## Output

```json
{
  "@type": "WebSite",
  "name": "Acme Docs",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: [Company site](/recipes/company-site/)
- External sources: [Schema.org WebSite](https://schema.org/WebSite)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `WebSite.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
