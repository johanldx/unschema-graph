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
| `GraphOptions` | Graph wrapping, ID resolution, duplicate strategy, and diagnostics options. |
| `GraphDiagnostic` | Structured duplicate-conflict or broken-reference diagnostic. |
| `DuplicateStrategy` | Duplicate policy: `merge`, `error`, `first`, or `last`. |
| `DuplicateEntityError` | Error thrown by the `error` duplicate strategy. |

## Validation

| Export | Purpose |
| --- | --- |
| `validateSchema(schema, data, options?)` | Parses with `throw`, `warn`, or `silent` failure handling. |
| `safeValidateSchema(schema, data, options?)` | Returns a discriminated success/error result. |
| `SchemaValidationError` | Error with `code`, `entityType`, raw `issues`, normalized `details`, and formatted message. |
| `GoogleArticle`, `GoogleRecipe` | Opt-in builders for the implemented Google consumer profiles. |
| `GoogleArticleSchema`, `GoogleRecipeSchema` | Composable profile schemas; passing them does not guarantee rich-result eligibility. |

## Dates and durations

| Export | Purpose |
| --- | --- |
| `formatIsoDuration(input)` | Converts duration shorthand to ISO 8601. |
| `parseDurationToMs(input)` | Converts a supported duration to milliseconds. |
| `parseDate(input, referenceDate?)` | Returns a `Date` or `null`, including relative expressions. |
| `formatIsoDate(input)` | Returns normalized ISO date/time output or throws. |
| `addDuration(date, duration)` | Adds a duration and returns an ISO string. |
| `diffDuration(start, end)` | Returns the difference as an ISO duration. |
| `DurationInput`, `DurationObject` | Public duration input types. |

`referenceDate` controls only a direct `parseDate()` call. Relative values passed through
builders or `formatIsoDate()` use the live execution-time clock; prefer explicit ISO input
for reproducible output.

## Serialization

| Export | Purpose |
| --- | --- |
| `serializeJsonLd(data, options?)` | Recommended way to inject JSON-LD into `<script>` tags; escapes `<`, `>`, `&`, `\u2028`, and `\u2029`. |
| `escapeJsonLd(json)` | Escapes sensitive HTML characters and Unicode separators in an existing JSON string. |
| `SerializeOptions` | `pretty` and `indent` settings. |

## References and shorthands

| Export | Purpose |
| --- | --- |
| `EntityReference<T>` | Typed relation input: a compatible entity, an ID string, or an explicit `{ '@id' }` object. |
| `EntityIdReference` | Shape of an explicit `{ '@id': string }` relation pointer. |
| `entityRef({ schemas, types?, fallbackType? })` | Creates the shared Zod relation schema used by built-in builders. |
| `createSearchAction(options)` | Creates a SearchAction and EntryPoint for a URL template. |

Use a specialized schema for each property instead of accepting every Schema.org entity:

```ts
const PublisherSchema = entityRef({
  schemas: [OrganizationSchema, PersonSchema],
  types: ['Organization', 'Person'],
  fallbackType: 'Organization',
});
```

The same primitive preserves direct builder entities, normalizes ID strings to `{ '@id' }`,
and expands plain strings with `fallbackType`. Without a fallback type, plain strings are
rejected; pass a direct entity, an explicit ID-looking string, or an `{ '@id' }` object.
Value objects such as addresses remain separate schemas so free-form strings are not
mistaken for entity references.

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
