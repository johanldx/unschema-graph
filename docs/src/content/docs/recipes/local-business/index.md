---
title: Local business
description: Describe a real business location with contact details, opening hours, and optional verified coordinates.
---

## Outcome

Describe a real business location with contact details, opening hours, and optional verified coordinates.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`LocalBusiness`](/reference/builders/local-business/), [`PostalAddress`](/reference/builders/postal-address/), [`GeoCoordinates`](/reference/builders/geo-coordinates/).

## Recommended graph

1. `LocalBusiness` — primary node
2. `PostalAddress`
3. `GeoCoordinates`

## Minimal example

```ts
import { LocalBusiness } from '@unschema-graph/core';

const entity = LocalBusiness({
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
});
```

## Production pattern

Use one node per physical location. Add geo only from a trusted source and keep opening hours aligned with customer-facing information.

```ts
const result = LocalBusiness.safeParse(cmsData);
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

1. **Combining several branches into one LocalBusiness.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Guessing latitude or longitude.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Publishing stale or malformed opening hours.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://schema.org/LocalBusiness).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
