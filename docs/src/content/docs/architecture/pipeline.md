---
title: Architecture and data pipeline
description: Public contracts and implementation model from source data to an HTML-safe JSON-LD script.
---

This page describes the modules and seams behind unschema-graph. Statements marked
**public contract** are safe to depend on within the current pre-1.0 release line.
Implementation notes explain the current design and may change without becoming API.

## Pipeline overview

```text
source data
    │ explicit mapping
    ▼
SchemaBuilder ── Zod parse ──► typed entity
    │                              │
    └──── structured error         ▼
                         buildJsonLdGraph
                           │ resolve identities
                           │ flatten and merge nodes
                           ▼
                       graph payload
                           │ serializeJsonLd
                           ▼
                  HTML-safe JSON string
                           │ Astro/Svelte adapter
                           ▼
             <script type="application/ld+json">
```

Text equivalent: application data is mapped into a builder. The builder validates and
returns a typed entity. The graph module resolves identities and merges nodes. The
serializer escapes the JSON string for an HTML script. A rendering adapter owns the
final script element.

## Builder interface

`defineSchema(type, schema, defaults?)` returns a callable `SchemaBuilder`. This is a
deep module: callers learn one interface while strict parsing, metadata injection and
error normalization remain inside the implementation.

| Member | Public contract |
| --- | --- |
| `builder(input, options?)` | Validates synchronously, owns `@type`, accepts optional `@id`, and returns an entity or `null` according to `onError`. |
| `builder.safeParse(unknown)` | Returns `{ success: true, data }` or `{ success: false, error }` without throwing. |
| `builder.schema` | Exposes the underlying Zod schema for composition and introspection. |
| `builder.entityType` | Exposes the primary Schema.org type literal. |

`SchemaInput<typeof schema>` removes caller-owned `@type` and adds optional `@id`.
`SchemaOutput<typeof schema, 'Type'>` describes parsed output with its guaranteed type.

```ts
import { defineSchema, type SchemaInput, type SchemaOutput } from '@unschema-graph/core';
import { z } from 'zod';

const BookSchema = z.object({ name: z.string().min(1), isbn: z.string().optional() });
const Book = defineSchema('Book', BookSchema);

type BookInput = SchemaInput<typeof BookSchema>;
type BookOutput = SchemaOutput<typeof BookSchema, 'Book'>;
```

Use `withAdditionalProperties(entity, properties)` only after validation for real
Schema.org properties not yet modeled. It cannot replace `@id` or `@type`.
`withAdditionalTypes(entity, types)` preserves the primary type and appends controlled
secondary types.

## Validation and errors

`throw` raises `SchemaValidationError`; `warn` logs and returns `null`; `silent` returns
`null`. The error exposes stable `code: 'SCHEMA_VALIDATION_ERROR'`, `entityType`, raw
Zod `issues`, normalized `details`, and `formattedMessage`. Treat `details` as the
programmatic diagnostic surface and the formatted message as presentation.

## Graph composition and identity

`buildJsonLdGraph(items, options?)` accepts a single entity, nested arrays and nullish
values. Its public contract is to return a fresh payload, resolve relative identifiers
against `baseUrl`, collapse nodes sharing a resolved `@id`, and wrap the result in
`@graph` by default. Input objects are not mutated.

```text
[#org stub] ─┐
             ├─ resolve same @id ─► merge properties ─► one #org node
[#org full] ─┘
```

The current traversal and merge order are implementation details. Do not depend on
internal helper names or traversal order; depend on the resulting identity and
non-mutation guarantees.

## Dates and durations

`parseDate()` accepts `Date`, timestamps, ISO values and documented relative forms.
`formatIsoDate()` emits normalized ISO output. `formatIsoDuration()` normalizes ISO,
human strings and duration objects; `parseDurationToMs()`, `addDuration()` and
`diffDuration()` provide calculations. Pass a reference date when deterministic tests
use relative input such as `today`.

## Serialization and threat model

`serializeJsonLd()` calls JSON serialization and escapes `<`, `>` and `&` as Unicode
escapes. This prevents data containing `</script>` from terminating the JSON-LD script.
It is not an HTML sanitizer and does not make untrusted values semantically true.
Validate at ingestion, never concatenate serialized fragments, and insert the returned
string only as the contents of an `application/ld+json` script.

## Stable contract versus explanation

Public exports, documented inputs, return values, error shapes and non-mutation are the
interface. File layout, helper functions, traversal passes, merge implementation and
adapter internals are explanations that may evolve. Tests should cross the same public
seam as application code.

Next: [Core reference](/integrations/core/), [helpers and types](/reference/helpers/),
[validation](/guides/validation/), and [security](/audit-and-quality/security/).
