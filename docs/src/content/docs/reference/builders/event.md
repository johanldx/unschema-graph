---
title: Event builder
description: Reference for the Event builder and its validated Schema.org Event output.
---

Creates an Event and can derive endDate from a duration. The `Event` builder injects `@type`, validates synchronously, and
rejects unknown properties.

## Import

```ts
// Astro — shown first when Astro is selected
import { Event } from '@unschema-graph/astro';

// Svelte 5
import { Event } from '@unschema-graph/svelte';

// Core / Node.js
import { Event } from '@unschema-graph/core';
import { EventSchema } from '@unschema-graph/core';
```

The `EventSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  EventSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type EventInput = SchemaInput<typeof EventSchema>;
type EventOutput = SchemaOutput<typeof EventSchema, 'Event'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | Yes | non-empty |
| `startDate` | string \| number \| Date | Yes | non-empty |
| `location` | string \| object | Yes | non-empty |
| `endDate` | string \| number \| Date | No | non-empty |
| `duration` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `description` | string | No | — |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `eventStatus` | string | No | — |
| `eventAttendanceMode` | string | No | — |
| `organizer` | Array<unknown> | No | — |
| `performer` | Array<unknown> | No | — |
| `offers` | [Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/) \| Array<[Offer](/reference/builders/offer/) \| Aggregate[Offer](/reference/builders/offer/)> | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Event'`.

## Minimal example

```ts
import { Event } from '@unschema-graph/core';

const entity = Event({
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
});
```

## Output

```json
{
  "@type": "Event",
  "name": "Astro meetup",
  "startDate": "2026-10-15T18:00:00+02:00",
  "location": "Paris, France"
}
```

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`Recipe`](/reference/builders/recipe/)
- Used by: [Events](/recipes/events/)
- External sources: [Schema.org Event](https://schema.org/Event) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/event)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Event.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
