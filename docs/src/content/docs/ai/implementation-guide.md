---
title: AI implementation guide
description: Authoritative environment choices, workflow and constraints for coding agents using unschema-graph.
---

Give this page to a coding agent before asking it to implement structured data. The installed
package's exported types and runtime validation remain the final authority if code and
documentation differ.

## Objective

Describe visible page content with the smallest accurate Schema.org graph, render it on the server
or at build time, then audit the emitted HTML. Do not invent facts to target a search feature.

## Choose the environment first

| Project | Package | Rendering path |
| --- | --- | --- |
| Astro | `@unschema-graph/astro` | Builders and Astro `<Schema />` component |
| Svelte 5 / SvelteKit | `@unschema-graph/svelte` | Builders and Svelte `<Schema />` component |
| Other framework or server | `@unschema-graph/core` | Builders, `createGraph()` and `serializeJsonLd()` |

Astro fits documentation sites that need its integration features, while Core and
Svelte are first-class entry points. Never install a framework adapter in an unrelated project.

## Required workflow

1. Inspect the page's visible content and select only matching Schema.org entities.
2. Choose Core, Astro or Svelte from the table above.
3. Create entities with official builders and give reusable entities stable `@id` values.
4. Connect entities by passing an entity or an accepted reference string.
5. Render one unified graph per page through the selected environment.
6. Build the project, inspect the emitted LD+JSON script, then run
   `npx @unschema-graph/core audit <output-directory>`.
7. Resolve every type, runtime, build and audit error before completion.

The public pipeline is: **builder input → validated entity → graph resolution → safe
serialization → framework adapter or HTML integration**. Read the
[architecture pipeline](/architecture/pipeline/) when a task crosses those boundaries.

## Canonical Astro pattern

```astro
---
import { Article, Organization, Schema } from '@unschema-graph/astro';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const article = Article({
  '@id': '#article',
  headline: 'A visible page title',
  image: '/images/article.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});
---

<Schema data={[organization, article]} />
```

Set Astro's `site` option to the canonical origin. Relative `@id`, `url` and `item` values are then
resolved against that URL without mutating the input entities. For another environment, load its
[quick start](/getting-started/choose-your-environment/) instead of adapting this component by
guesswork.

## Non-negotiable constraints

- Do not hand-write the JSON-LD script when an official builder exists.
- Do not invent builder properties or cast invalid input to `any`.
- Do not describe ratings, prices, availability or relationships absent from the page.
- Do not duplicate reusable entities; identify and reference them.
- Do not add Astro `client:*` directives or move server-side generation into the browser.
- Do not import the Node-only `@unschema-graph/core/audit` entry point into browser code.
- Do not claim that valid JSON-LD guarantees ranking, eligibility or a rich result.

## Validation, CMS data and controlled extension

Use `Builder.safeParse()` at trust boundaries such as CMS and API payloads. Keep production and CI
failures visible. If Schema.org supports a property that the library does not model, validate the
entity first and then use `withAdditionalProperties()`. It cannot replace `@type` or `@id`. Use
`withAdditionalTypes()` for secondary Schema.org types.

Read [security and CMS inputs](/audit-and-quality/security/) before handling untrusted data and
[known limitations](/operations/known-limitations/) before building an unsupported shape.

## Graph and reference rules

- Use fragments such as `#organization` for page-wide entities.
- Use stable path or absolute IDs for reusable site entities.
- A string beginning with `#`, `/`, `http://`, `https://` or `urn:` becomes an `@id` reference where
  references are accepted.
- Entities with the same resolved `@id` are merged; later values override earlier values.
- Pass the most complete representation last when deliberately enriching the same node.

## Load only what the task needs

1. Start with the environment's quick start.
2. Open the relevant builder page for required fields and related types.
3. Add [graphs and references](/guides/graphs-and-references/) for multi-entity pages.
4. Add [validation](/guides/validation/) for external input.
5. Use the [API reference](/reference/helpers/) only for advanced helpers.
6. Use [custom schemas](/guides/custom-schemas/) only when no official builder fits.

Every documentation page has a focused `.md` route. `/llms.txt` is the concise English index and
`/llms-full.txt` is the complete English bundle. French pages also expose focused Markdown routes;
see [using Markdown with an agent](/ai/using-markdown/).

## Completion checklist

- The package matches the project's environment.
- Entities match visible content and every builder receives its required fields.
- Reusable entities have stable `@id` values and the page renders one graph.
- The canonical base URL is intentional.
- The production build and audit both exit successfully.
- No validation mode hides errors in CI.
- Search-engine-specific behavior is described as eligibility, never a guarantee.
