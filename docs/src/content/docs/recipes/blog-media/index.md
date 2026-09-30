---
title: Blog & media
description: Publish an article graph with a stable author, publisher, page, image, and breadcrumb trail.
---

## Outcome

Publish an article graph with a stable author, publisher, page, image, and breadcrumb trail.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`Person`](/reference/builders/person/), [`Organization`](/reference/builders/organization/), [`WebPage`](/reference/builders/web-page/), [`ImageObject`](/reference/builders/image-object/), [`BreadcrumbList`](/reference/builders/breadcrumb-list/).

## Recommended graph

1. `Article` — primary node
2. `BlogPosting`
3. `Person`
4. `Organization`
5. `WebPage`
6. `ImageObject`
7. `BreadcrumbList`

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

Give every reusable identity an absolute or resolvable `@id`. Keep the visible headline, dates, author, and images identical to the page content.

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

1. **Missing one of headline, image, datePublished, or author.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Using a publisher name where a stable Organization reference is needed.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Marking content that is not visible on the page.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://schema.org/Article).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
