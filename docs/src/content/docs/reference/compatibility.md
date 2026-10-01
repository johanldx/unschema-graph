---
title: Compatibility matrix
description: Runtime and peer-dependency support derived from the package manifests.
---

This matrix reflects the published package manifests, not an aspirational roadmap.

## The `1.0` compatibility contract

The `1.0` release establishes a strict compatibility contract. It guarantees:

- a public API governed by Semantic Versioning;
- consistent TypeScript and runtime validation contracts;
- deterministic graph composition and reference resolution;
- npm packages that work through their documented public exports; and
- documentation sufficient to use the library without reading its source code.

The product contract covers the complete structured-data pipeline:

```text
typed entities
→ runtime validation
→ graph composition
→ reference resolution
→ safe serialization
→ framework integration
→ static audit / CI
```

In short, unschema-graph builds type-safe, validated and safely serialized Schema.org
JSON-LD with graph composition, framework integrations and CI auditing. Its scope is
structured data; `1.0` will not turn it into a general-purpose SEO framework.

## Current compatibility

| Surface | Supported range | Rendering model | Notes |
| --- | --- | --- | --- |
| Core | Node `>=22.12.0`, Zod `^4.6.0` | Framework-neutral | Browser-safe root export; `core/audit` is Node-only. |
| Astro | Astro `^5.0.0 || ^6.0.0 || ^7.0.0`, Node `>=22.12.0` | Static and SSR | Component adds no client JavaScript. Integration supplies build/dev defaults. |
| Svelte | Svelte `^5.15.0`, Node `>=22.12.0` for tooling | SSR and reactive client navigation | Native runes component using `svelte:head`; the lower bound is tested from the packed package. |
| SvelteKit | Representative current `2.x` consumer fixture | SSR, prerendering, client navigation | No independent peer range or adapter is promised; use the Svelte package. |
| Schema.org | Baseline `30.1` (`SCHEMA_ORG_BASELINE`) | Vocabulary definition | Built-in schemas model a curated subset of this vocabulary, not the complete vocabulary. |
| Zod | `^4.6.0` | Runtime validation | Peer dependency of Core. |

CI runs on Node `22.12.0`. Packed-package fixtures install the exact boundary/current
pairs Astro `5.0.0`, `6.0.0`, and `7.3.5`; Svelte `5.15.0` and `5.57.1`; and Zod
`4.6.0` and `4.6.5`. npm consumer fixtures additionally exercise Core with current Zod
and Astro `7.3.5`. The peer ranges above remain the package acceptance contract.

### Temporal, dates, and timezone policy

- **Pure dates (`YYYY-MM-DD`)**: preserved as pure date strings without time or timezone conversion.
- **Explicit datetimes (`YYYY-MM-DDTHH:mm:ssZ` or with offset `+02:00`)**: preserved strictly with their explicit offset to respect author intent.
- **Relative expressions (`today`, `tomorrow`, `+30d`)**: evaluated against the live execution-time clock by builders, `IsoDateSchema`, and `formatIsoDate()`. Only direct `parseDate(input, referenceDate)` calls accept a fixed reference. Use explicit ISO values in builder input for reproducible builds.

The Node `>=22.12.0` floor is deliberate. At the v1 compatibility freeze, Node 22 is the
oldest maintained LTS line and is exercised by both CI and the published-package fixtures.
The Core root export remains browser-safe, but older or end-of-life Node lines are not part
of the maintained package contract.

See the [Astro integration](/integrations/astro/), [Svelte integration](/integrations/svelte/),
and [Core integration](/integrations/core/).

## The `1.0` public API

The following entry points form the guaranteed v1 public surface. Importing files below
`dist/` or any source path is never supported.

| Package | Public entry points | v1 contract |
| --- | --- | --- |
| `@unschema-graph/core` | `.`, `./audit` | Builders, graph construction, validation, serialization, configuration, temporal helpers and HTML audit. |
| `@unschema-graph/astro` | `.`, `./integration`, `./content`, `./Schema.astro` | Complete Core re-export, Astro integration, component and Content Collections mappers. |
| `@unschema-graph/svelte` | `.`, `./Schema.svelte` | Complete Core re-export and native Svelte 5 component. |

The guaranteed Core functions are:

```text
defineSchema                 buildJsonLdGraph
serializeJsonLd              escapeJsonLd
validateSchema               safeValidateSchema
withAdditionalProperties     withAdditionalTypes
setGlobalConfig              getGlobalConfig
resetGlobalConfig            createSearchAction
entityRef
formatIsoDuration            parseDurationToMs
parseDate                    formatIsoDate
addDuration                  diffDuration
```

The contract also includes every builder and corresponding schema in the
[builder catalog](/reference/builders/), the `SchemaValidationError` class, and these
public utility types:

```text
SchemaInput                  SchemaOutput
SchemaBuilder                SchemaOrgEntity
SchemaProps                  SchemaGraphOptions
ValidationOptions            GraphOptions
SerializeOptions             Severity
SchemaValidationErrorCode    SchemaValidationIssue
SchemaValidationResult       DurationInput
DurationObject               SearchActionOptions
EntityReference              EntityIdReference
```

The `@unschema-graph/core/audit` contract includes `auditHtmlContent()`,
`auditHtmlDirectory()`, `getHtmlFiles()`, `AuditError` and `AuditResult`.

The Astro-specific contract includes `Schema`, `schemaGraph()`, `toArticle()`,
`toBlogPosting()`, `toNewsArticle()`, `ContentEntryLike` and `ArticleMappingOptions`.
The Astro `<Schema />` component accepts all shared props plus `debug`:

```text
data    item        items       pretty      indent
context graph       baseUrl     inLanguage  debug
```

`data`, `item` and `items` are supported aliases. When several are provided, their
entities are combined in that order. In Astro, an explicit `baseUrl` takes precedence
over the integration/global default, with `Astro.site` as the final fallback.

The Svelte-specific contract includes `Schema` and the complete Core re-export. Its
`<Schema />` component accepts the shared props (`data`, `item`, `items`, `pretty`,
`indent`, `context`, `graph`, `baseUrl`, `inLanguage`), renders through `svelte:head`,
supports SSR and SvelteKit, and requires no client JavaScript for static input.

Internal helper functions and low-level schemas not listed above are considered implementation details
and should not be imported directly. Always rely on the documented public surface.

## Semantic Versioning policy in `1.x`

> **Version 0.9.0 — v1 stabilization candidate**
> Release `0.9.0` is the pre-v1 stabilization release. The actual Release Candidate is `1.0.0-rc.1`, followed by stable `1.0.0`; breaking corrections can therefore still occur before the RC contract is frozen.

- **PATCH** fixes a defect without removing an API or changing documented valid input
  into invalid input.
- **MINOR** adds backward-compatible builders, optional properties, overloads or entry
  points.
- **MAJOR** removes or renames a public symbol, rejects previously documented valid
  input, or changes documented JSON-LD, reference, merge, deduplication or error behavior.

Validation rules and documented output are part of the compatibility contract, not
implementation details. Tightening a rule or changing a normalized output therefore
requires a major release unless the old behavior contradicted the documentation and the
change is released as a clearly identified bug fix.

## Deprecation policy

When a public API must be retired, it is marked with TypeScript `@deprecated`, announced
in release notes and documented with its replacement. It remains available for the rest
of the current major when practical and is removed only in a future major release.
Runtime warnings, when unavoidable, are development-only, emitted once and include an
actionable replacement; production output stays silent.
