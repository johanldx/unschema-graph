---
title: Troubleshooting by symptom
description: Diagnose build failures, missing scripts, unresolved identities, invalid CMS data, and audit errors.
---

Start with the observed symptom, then verify the probable cause before changing data.

| Symptom | Probable cause | Resolution |
| --- | --- | --- |
| `SchemaValidationError` during build | Missing required field or unknown property | Read `error.details`; map only documented fields and use the linked builder reference. |
| Builder returns `null` | `onError` is `warn` or `silent` | Use `safeParse()` at the data boundary, or `throw` in CI. |
| No JSON-LD script in HTML | Empty/null entity list or component outside the rendered route | Inspect the built HTML and move `<Schema />` into the active page/layout head. |
| Relative `@id` remains unresolved | No `baseUrl`/Astro `site` | Configure the canonical origin or pass `baseUrl` explicitly. |
| Duplicate nodes | Reused entity has different or missing `@id` values | Assign one stable identifier and reference it consistently. |
| Audit reports invalid JSON | Hand-written serialization or truncated script | Render through `<Schema />` or `serializeJsonLd()`; never concatenate JSON. |
| Audit finds no blocks | Wrong output directory or pages contain no schema | Build first, confirm the adapter output path, then audit that directory. |
| Rich result is absent | Markup may be valid but not eligible, indexed, or selected | Compare visible content with the relevant search-engine requirements; eligibility is not a guarantee. |

## Diagnostic order

1. Run `builder.safeParse(source)` and inspect normalized issue paths.
2. Inspect the server-rendered or built HTML, not the source template.
3. Run `unschema-graph audit <output-directory>`.
4. Validate the public URL with the relevant external testing tool.
5. Check crawling, indexing, visible content, and feature-specific eligibility separately.

If a CMS field is optional in your model but required by a builder, stop the render with
an actionable editorial error. Do not invent placeholders.

Next: [validation](/guides/validation/), [security](/audit-and-quality/security/), and
[audit CLI](/audit-and-quality/audit-cli/).
