---
title: Known limitations
description: Explicit boundaries of schema coverage, auditing, search eligibility, and pre-1.0 stability.
---

- The 51 builders intentionally model a strict subset of Schema.org, not the complete vocabulary.
- `withAdditionalProperties()` permits controlled extensions after validation; it cannot prove an extension is meaningful or eligible for a search feature.
- The audit checks JSON syntax and graph structure in built HTML. It does not crawl URLs, validate every Schema.org semantic rule, or guarantee rich results.
- Relative identities require a correct `baseUrl`; Core and Svelte do not infer an origin from framework configuration.
- Content helpers recognize documented conventional field names. Custom CMS models require explicit overrides or mappings.
- Relative date expressions depend on the current clock unless a reference date is supplied.
- The Node audit entry point is not browser-safe.
- The project is pre-1.0; documented interfaces can still evolve with release notes.

These constraints are product boundaries, not hidden failures. See
[troubleshooting](/operations/troubleshooting/) for diagnosis and
[migrations](/operations/migrations/) before upgrading.
