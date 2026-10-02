---
title: Known limitations
description: Explicit boundaries of schema coverage, auditing, search eligibility, and 1.x stability.
---

- The 51 builders intentionally model a strict subset of Schema.org, not the complete vocabulary.
- `withAdditionalProperties()` permits controlled extensions after validation; it cannot prove an extension is meaningful or eligible for a search feature.
- The audit checks JSON syntax and graph structure in built HTML. It does not crawl URLs, validate every Schema.org semantic rule, or guarantee rich results.
- Relative identities require a correct `baseUrl`; Core and Svelte do not infer an origin from framework configuration.
- Content helpers recognize documented conventional field names. Custom CMS models require explicit overrides or mappings.
- Relative date expressions in builders and transforming schemas depend on the live clock; only direct `parseDate()` calls accept a reference date.
- The Node audit entry point is not browser-safe.
- In 1.x, public APIs are governed by strict Semantic Versioning; breaking changes are reserved for major versions.

These constraints are product boundaries, not hidden failures. See
[troubleshooting](/operations/troubleshooting/) for diagnosis and
[migrations](/operations/migrations/) before upgrading.
