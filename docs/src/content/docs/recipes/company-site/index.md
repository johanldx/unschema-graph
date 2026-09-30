---
title: Company site
description: Describe one organization once and reference it from the website and its pages.
---

## Outcome

Describe one organization once and reference it from the website and its pages.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Organization`](/reference/builders/organization/), [`WebSite`](/reference/builders/web-site/), [`WebPage`](/reference/builders/web-page/).

## Recommended graph

1. `Organization` — primary node
2. `WebSite`
3. `WebPage`

## Minimal example

```ts
import { Organization } from '@unschema-graph/core';

const entity = Organization({
  "name": "Acme",
  "url": "https://example.com"
});
```

## Production pattern

Place the canonical Organization and WebSite nodes in the global layout; add a distinct WebPage node for each canonical page URL.

```ts
const result = Organization.safeParse(cmsData);
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

1. **Changing the organization @id between pages.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Using relative identifiers without a baseUrl.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Creating a second full Organization node for every page.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://schema.org/Organization).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
