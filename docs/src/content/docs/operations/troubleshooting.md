---
title: Troubleshooting by symptom
description: Diagnose build failures, missing scripts, unresolved identities, invalid CMS data, and audit errors.
---

Start with the observed symptom, then verify the probable cause before changing data.

| Symptom | Probable cause | Resolution |
| --- | --- | --- |
| `SchemaValidationError` during build | Missing required field or unknown property | Read `error.details`; map only documented fields and use the linked builder reference. |
| `duplicate-conflict` diagnostic | Two nodes share an `@id` with conflicting property values | Unify definitions or choose the appropriate `duplicateStrategy`. |
| `broken-reference` diagnostic | An `@id` points to a fragment/node not present in the graph | Verify target `@id` or pass the missing entity to `buildJsonLdGraph`. |
| `NonSerializableValueError` | Payload contains `BigInt`, `Symbol`, `Function`, `NaN`, or `Infinity` | Convert numbers and values to standard JSON-compatible types. |
| Infinite loop / stack overflow | Cyclic relation between entities without `@id` | Assign an `@id` to each entity in the cycle so they resolve as graph pointers. |
| Builder returns `null` | `onError` is `warn` or `silent` | Use `safeParse()` at the data boundary, or `throw` in CI. |
| No JSON-LD script in HTML | Empty/null entity list or component outside the rendered route | Inspect the built HTML and move `<Schema />` into the active page/layout head. |
| Relative `@id` remains unresolved | No `baseUrl`/Astro `site` | Configure the canonical origin or pass `baseUrl` explicitly. |
| Audit reports invalid JSON | Hand-written serialization or truncated script | Render through `<Schema />` or `serializeJsonLd()`; never concatenate JSON. |
| Rich result is absent | Markup may be valid but not eligible, indexed, or selected | Compare visible content with the relevant search-engine requirements; eligibility is not a guarantee. |

---

## Common Issues & Diagnosing Them

### 1. Broken References (`broken-reference`)

A broken reference occurs when an entity points to an `@id` (such as `publisher: '#acme'`) that does not correspond to any node in the collected graph.

```ts
// ❌ Broken reference: '#acme' is referenced but never declared
const article = Article({
  headline: 'Getting Started',
  publisher: '#acme', // No Organization with @id: '#acme' exists!
});
```

**How to detect:**
- Intercept diagnostics via the `onDiagnostic` callback:
  ```ts
  const graph = buildJsonLdGraph(article, {
    baseUrl: 'https://example.com',
    onDiagnostic(diagnostic) {
      if (diagnostic.code === 'broken-reference') {
        console.warn(`Broken reference detected: ${diagnostic.message}`);
      }
    },
  });
  ```
- Run the audit CLI in CI: `unschema-graph audit dist --strict`. Broken local references fail with exit code `1`.

**Resolution:**
Pass the referenced entity into the graph or use entity-object references:
```ts
const acme = Organization({ '@id': '#acme', name: 'Acme Inc' });
const article = Article({ headline: 'Getting Started', publisher: acme });
const graph = buildJsonLdGraph(article, { baseUrl: 'https://example.com' });
```

---

### 2. Duplicate Conflicts (`duplicate-conflict`)

When two entities declare the same resolved `@id` but provide different values for the same property, a conflict occurs.

```ts
const org1 = Organization({ '@id': '#org', name: 'Acme Corporation' });
const org2 = Organization({ '@id': '#org', name: 'Acme Corp.' }); // Different name!
```

Under the default `duplicateStrategy: 'merge'`, properties are merged and the later scalar value overwrites the earlier one. A `duplicate-conflict` diagnostic is emitted to alert you.

**Resolution:**
- Declare shared entities once (e.g. in a shared layout or config file) and reference them.
- If conflicts indicate bugs in your data pipeline, set `duplicateStrategy: 'error'` to throw `DuplicateEntityError` immediately.

---

### 3. Circular References

In real-world graphs, entities frequently reference each other. For example, an `Author` writes a `Book`, and the `Book` lists the `Author`.

- **Safe when entities have `@id`:** unschema-graph handles cycles cleanly by emitting top-level graph nodes and replacing nested references with `{ "@id": "..." }` pointers.
- **Problematic without `@id`:** Value objects or entities without `@id` cannot be referenced by pointer. If they contain circular JavaScript object references, recursion cannot resolve them.

**Resolution:**
Always provide an `@id` to any entity participating in a bidirectional or circular relationship.

---

### 4. Unrecognized Properties & Schema Extensions

unschema-graph builders validate strictly against Schema.org standards. Any unrecognized property that is not defined in Schema.org will be stripped or throw a `SchemaValidationError`.

**If you have custom or pending properties:**
- Use `withAdditionalProperties` to allow specific custom keys:
  ```ts
  import { Article, withAdditionalProperties } from '@unschema-graph/core';

  const CustomArticle = withAdditionalProperties(Article, ['customScore', 'internalId']);
  ```
- Or define a brand-new schema using `defineSchema`:
  ```ts
  import { defineSchema, z } from '@unschema-graph/core';

  const CustomBadge = defineSchema('CustomBadge', {
    badgeLevel: z.string(),
  });
  ```

---

### 5. Non-Serializable Values

JSON-LD must serialize to standard JSON. Values such as `BigInt`, `Symbol`, `Function`, `NaN`, or `Infinity` cannot be serialized and will throw `NonSerializableValueError`.

**Resolution:**
Convert `BigInt` or timestamps to standard strings or numbers (`toISOString()` or `Number()`) before passing them to builders.

---

## Diagnostic Order

1. Run `builder.safeParse(source)` and inspect normalized issue paths.
2. Inspect the server-rendered or built HTML, not the source template.
3. Run `unschema-graph audit <output-directory> --strict`.
4. Validate the public URL with the relevant external testing tool (e.g. Google Rich Results Test or Schema.org Validator).
5. Check crawling, indexing, visible content, and feature-specific eligibility separately.

If a CMS field is optional in your model but required by a builder, stop the render with
an actionable editorial error. Do not invent placeholders.

Next: [validation](/guides/validation/), [security](/audit-and-quality/security/), and
[audit CLI](/audit-and-quality/audit-cli/).
