---
title: Dates and durations
description: Flexible date inputs, human duration shorthands, and ISO 8601 temporal arithmetic.
---

The temporal builders normalize supported date and duration inputs to ISO 8601 output,
such as `2026-09-29T10:00:00.000Z` and `PT1H30M`. Human-friendly shorthands are a
library input feature; the generated JSON-LD receives the normalized value.

---

## 1. Date inputs

Properties backed by `IsoDateSchema` (such as `datePublished`, `dateModified`, `startDate`, `validThrough`, etc.) accept:

- JavaScript `Date` instances (`new Date()`);
- Unix timestamps in seconds or milliseconds (`1727600000`);
- Standard ISO 8601 date strings (`'2026-09-29'`);
- Human tokens: `'now'`, `'today'`, `'tomorrow'`, and `'yesterday'`;
- Relative duration expressions: `'+30d'`, `'-2w'`, `'+6m'`, `'+1y'`, `'+4h'`.

```ts
import { JobPosting } from '@unschema-graph/core';

const job = JobPosting({
  title: 'Full Stack Engineer',
  description: 'Building modern web applications.',
  datePosted: 'today',
  validThrough: '+30d',
  hiringOrganization: '#organization',
});
```

:::tip
Relative date expressions (`'today'`, `'+30d'`) are computed at build or SSR execution time.
Only a direct `parseDate(input, referenceDate)` call can use a fixed clock. Builders,
`IsoDateSchema`, and `formatIsoDate()` use the live clock, so pass explicit ISO values when
the generated output must be reproducible.
:::

---

## 2. Duration shorthands

Properties backed by `IsoDurationSchema` (such as `cookTime`, `prepTime`, `duration`, `totalTime`) accept:

1. **Human duration strings:** `'45m'`, `'1h30'`, `'1h30m'`, `'2h'`, `'15s'`, `'2d'`.
2. **Numbers (representing minutes):** `45` becomes `PT45M`, `120` becomes `PT120M`.
3. **Structured duration objects:** `{ hours: 1, minutes: 15 }`, `{ days: 1, hours: 2 }`.
4. **Existing ISO 8601 duration strings:** `'PT1H30M'`, `'P2D'`.

```ts
import { Recipe } from '@unschema-graph/core';

const recipe = Recipe({
  name: 'Homemade Apple Tart',
  image: 'https://example.com/tart.jpg',
  recipeIngredient: ['4 apples', '200g puff pastry', '50g sugar'],
  recipeInstructions: ['Peel apples', 'Arrange slices', 'Bake at 180°C'],
  prepTime: '15m',        // Normalizes to 'PT15M'
  cookTime: '30m',        // Normalizes to 'PT30M'
  totalTime: '45m',       // Normalizes to 'PT45M'
});
```

---

## 3. Temporal arithmetic helpers

`@unschema-graph/core` exports pure helper functions for date and duration calculations:

```ts
import {
  addDuration,
  diffDuration,
  formatIsoDate,
  formatIsoDuration,
  parseDurationToMs,
} from '@unschema-graph/core';

// Format duration
formatIsoDuration('1h30'); // 'PT1H30M'
formatIsoDuration({ hours: 2, minutes: 15 }); // 'PT2H15M'

// Convert to milliseconds
parseDurationToMs('45m'); // 2700000

// Add duration to a date
const eventStart = '2026-11-20T19:00:00Z';
const eventEnd = addDuration(eventStart, '2h30');
// Result: '2026-11-20T21:30:00.000Z'

// Compute difference between two dates as ISO duration
const duration = diffDuration('2026-11-20T19:00:00Z', '2026-11-20T21:00:00Z');
// Result: 'PT2H'
```

### Automatic `endDate` calculation in `Event`

When creating an `Event` with `startDate` and `duration`, unschema-graph automatically calculates `endDate` if omitted:

```ts
import { Event } from '@unschema-graph/core';

const meetup = Event({
  name: 'Svelte Paris Meetup',
  startDate: '2026-11-20T19:00:00+01:00',
  duration: '2h00',
  // endDate is automatically computed as '2026-11-20T20:00:00.000Z'.
});
```

Relative dates depend on the clock and timezone of the build or server process. Prefer
explicit ISO values for reproducible builds and content that must preserve an exact
publication instant.

Next: learn [how JSON-LD is serialized safely into HTML](/audit-and-quality/security/).
