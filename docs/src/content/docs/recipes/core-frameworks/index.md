---
title: Core in any framework
description: Use the universal engine when no dedicated rendering integration exists.
---

## Outcome

Use the universal engine when no dedicated rendering integration exists.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Article`](/reference/builders/article/), [`Organization`](/reference/builders/organization/).

## Recommended graph

1. `Article` — primary node
2. `Organization`

## Minimal example

```ts
import { Article } from '@unschema-graph/core';

const entity = Article({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Production pattern

Build and serialize on the server, then place the returned string in one application/ld+json script without parsing and re-stringifying it.

```ts
const result = Article.safeParse(cmsData);
if (!result.success) {
  throw new Error(result.error.issues.map((issue) => issue.message).join('\n'));
}

const graph = buildJsonLdGraph([result.data], { baseUrl: 'https://example.com' });
```

## Environment variants

| Astro | Svelte 5 / SvelteKit | Core |
| --- | --- | --- |
| `<Schema items={items} />` | `<Schema items={items} />` | `serializeJsonLd(buildJsonLdGraph(items))` |

## Common errors and diagnosis

1. **Importing the Node audit entry point into browser code.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Serializing with plain JSON.stringify in HTML.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Forgetting baseUrl when resolving relative identifiers.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Related documentation](/integrations/core/).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
