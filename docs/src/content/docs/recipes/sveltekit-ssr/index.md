---
title: SvelteKit & SSR
description: Render page-specific JSON-LD during SSR while keeping shared identities in layout data.
---

## Outcome

Render page-specific JSON-LD during SSR while keeping shared identities in layout data.

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

Return serializable source data from load functions, build entities close to the component, and use reactive values only when content actually changes client-side.

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

1. **Building browser-only values during SSR.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Duplicating the global organization in every route.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Expecting client navigation to fix invalid server output.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://svelte.dev/docs/kit/load).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
