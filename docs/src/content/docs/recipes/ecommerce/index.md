---
title: E-commerce
description: Represent one purchasable product with current price, availability, and evidence-backed ratings.
---

## Outcome

Represent one purchasable product with current price, availability, and evidence-backed ratings.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Product`](/reference/builders/product/), [`Offer`](/reference/builders/offer/), [`AggregateOffer`](/reference/builders/aggregate-offer/), [`Review`](/reference/builders/review/), [`AggregateRating`](/reference/builders/aggregate-rating/).

## Recommended graph

1. `Product` — primary node
2. `Offer`
3. `AggregateOffer`
4. `Review`
5. `AggregateRating`

## Minimal example

```ts
import { Product } from '@unschema-graph/core';

const entity = Product({
  "name": "Mechanical keyboard",
  "sku": "KB-001",
  "brand": "Acme"
});
```

## Production pattern

Choose Offer for one purchasable price and AggregateOffer for a genuine range. Refresh price and availability with the page data.

```ts
const result = Product.safeParse(cmsData);
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

1. **Price or availability differs from visible content.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Using AggregateOffer for a single price.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Publishing ratings that are not collected and shown by the site.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://schema.org/Product).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
