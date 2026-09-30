---
title: Audit in CI
description: Fail a deployment when generated HTML contains malformed or structurally invalid JSON-LD.
---

## Outcome

Fail a deployment when generated HTML contains malformed or structurally invalid JSON-LD.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Article`](/reference/builders/article/).

## Recommended graph

1. `Article` — primary node

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

Build first, audit the actual output directory, preserve the CLI exit code, and upload the build artifact when diagnosis is needed.

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

## GitHub Actions

```yaml
- run: pnpm run build
- run: pnpm exec unschema-graph audit dist
```

The command exits with `0` when valid and a non-zero code when errors are found.

## Common errors and diagnosis

1. **Auditing source templates instead of built HTML.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Pointing the command at the wrong output directory.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Masking a non-zero audit exit code in a shell pipeline.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Related documentation](/audit-and-quality/audit-cli/).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
