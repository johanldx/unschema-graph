---
title: Events
description: Publish one event occurrence with explicit dates, venue, ticket offer, and lifecycle status.
---

## Outcome

Publish one event occurrence with explicit dates, venue, ticket offer, and lifecycle status.

> **Local validation** — Builders reject unknown properties and expose `safeParse()` for external data.
>
> **Schema.org** — The vocabulary defines property meaning; it does not guarantee any search appearance.
>
> **Google eligibility** — Google requirements are additional and can change. Valid markup never guarantees a rich result.

## Prerequisites

- A trustworthy canonical URL and `baseUrl`.
- Current, visible data from your domain source.
- Related builders: [`Event`](/reference/builders/event/), [`Offer`](/reference/builders/offer/), [`PostalAddress`](/reference/builders/postal-address/).

## Recommended graph

1. `Event` — primary node
2. `Offer`
3. `PostalAddress`

## Minimal example

```ts
import { Event } from '@unschema-graph/core';

const entity = Event({
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
});
```

## Production pattern

Use ISO 8601 offsets when the local time zone matters. On cancellation, retain the event URL and set eventStatus instead of deleting the node.

```ts
const result = Event.safeParse(cmsData);
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

1. **Omitting the time-zone offset for a timed event.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
2. **Putting the event name in location.name.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.
3. **Deleting a cancelled event instead of updating its status.** Compare the source data, `safeParse()` result, and JSON-LD in the built HTML.

## Validation

1. Run `safeParse()` at the data boundary.
2. Inspect the script in built HTML.
3. Run `unschema-graph audit` against the output directory.
4. [Schema.org / official documentation](https://schema.org/Event).

## Final checklist

- [ ] Marked-up content is visible and current.
- [ ] Every reusable identity has a stable `@id`.
- [ ] Local validation and the build audit pass.
- [ ] Eligibility is understood as non-guaranteed.

Go deeper: [graphs and references](/guides/graphs-and-references/), [validation](/guides/validation/), [audit CLI](/audit-and-quality/audit-cli/).
