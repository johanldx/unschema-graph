---
title: Helpers and types
description: Reference for graph, validation, temporal, serialization, content, and extension helpers.
---

## Builder creation and extension

| Export | Purpose |
| --- | --- |
| `defineSchema(type, schema, defaults?)` | Creates a strict callable builder from a Zod schema. |
| `withAdditionalProperties(entity, properties)` | Adds explicitly chosen properties after validation. Cannot replace `@type` or `@id`. |
| `withAdditionalTypes(entity, types)` | Adds one or more secondary Schema.org types while retaining the primary type. |
| `SchemaBuilder` | Callable builder interface with `.schema`, `.entityType`, and `.safeParse()`. |
| `SchemaInput`, `SchemaOutput` | Infers builder input and output from a Zod schema. |

## Graph composition

| Export | Purpose |
| --- | --- |
| `buildJsonLdGraph(items, options?)` | Flattens, resolves, deduplicates, and wraps entities. |
| `resolveId(id, baseUrl?)` | Resolves a relative identifier against a canonical URL. |
| `resolveEntityIds(value, baseUrl?)` | Recursively resolves `@id`, `item`, and `url` values in a copied structure. |
| `GraphOptions` | `graph`, `context`, and `baseUrl` options. |

## Validation

| Export | Purpose |
| --- | --- |
| `validateSchema(schema, data, options?)` | Parses with `throw`, `warn`, or `silent` failure handling. |
| `safeValidateSchema(schema, data, options?)` | Returns a discriminated success/error result. |
| `formatZodError(error, entityType?, data?)` | Produces the terminal-friendly diagnostic string. |
| `normalizeZodIssues(error, entityType?, data?)` | Produces stable structured issue details. |
| `SchemaValidationError` | Error with `code`, `entityType`, raw `issues`, normalized `details`, and formatted message. |

## Dates and durations

| Export | Purpose |
| --- | --- |
| `formatIsoDuration(input)` | Converts duration shorthand to ISO 8601. |
| `parseDurationToMs(input)` | Converts a supported duration to milliseconds. |
| `parseDate(input, referenceDate?)` | Returns a `Date` or `null`, including relative expressions. |
| `formatIsoDate(input)` | Returns normalized ISO date/time output or throws. |
| `addDuration(date, duration)` | Adds a duration and returns an ISO string. |
| `diffDuration(start, end)` | Returns the difference as an ISO duration. |
| `IsoDateSchema`, `IsoDurationSchema` | Reusable transforming Zod schemas. |
| `DurationInput`, `DurationObject` | Public duration input types. |

## Serialization

| Export | Purpose |
| --- | --- |
| `serializeJsonLd(data, options?)` | JSON-serializes and escapes unsafe HTML characters. |
| `escapeJsonLd(json)` | Escapes `<`, `>`, and `&` in an existing JSON string. |
| `SerializeOptions` | `pretty` and `indent` settings. |

## References and shorthands

| Export | Purpose |
| --- | --- |
| `isIdReference(value)` | Detects fragment, path, HTTP(S), and URN reference strings. |
| `createEntityRef(schema, fallbackType?)` | Creates a Zod union for embedded entities and string/object references. |
| `createSearchAction(options)` | Creates a SearchAction and EntryPoint for a URL template. |
| `SpeakableSchema` | Validates and transforms CSS selectors or XPath into SpeakableSpecification. |

## Content helpers

Import these from either the package root or `@unschema-graph/astro/content`:

| Export | Purpose |
| --- | --- |
| `toArticle`, `toBlogPosting`, `toNewsArticle` | Map an Astro content entry to a validated article entity. |
| `extractImage` | Converts strings or Astro image metadata into an image value. |
| `extractKeywords` | Converts arrays or comma-separated strings into keyword arrays. |
| `extractWordCount` | Computes a simple word count from source content. |
| `ContentEntryLike`, `ArticleMappingOptions` | Public mapping types. |

## Programmatic audit

Import `getHtmlFiles`, `auditHtmlContent`, `auditHtmlDirectory`, `AuditError`, and `AuditResult` from
`@unschema-graph/core/audit`. This entry point uses Node.js filesystem modules and should only run in
build tooling or server code.
