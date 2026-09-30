---
title: Security & Anti-XSS Protection
description: JSON-LD Unicode escaping, trust boundaries, and safe usage with headless CMS and user-generated content.
---

JSON-LD is data, but its `<script>` element is still parsed by the HTML parser. Embedding
an unescaped closing script tag from CMS or user content can end the data block and
create a Cross-Site Scripting (XSS) path.

`unschema-graph` prevents this script-breakout path by default across all packages.

## Safe default

Render with `<Schema />` or serialize with `serializeJsonLd()`. Do not insert the result
of plain `JSON.stringify()` into an HTML script element. Continue to validate and escape
the same untrusted content separately when it is rendered as visible HTML.

---

## 1. The script-breakout vulnerability

Standard `JSON.stringify()` does **not** escape `<`, `>`, or `&`.

Consider this malicious CMS input:

```json
{
  "headline": "A great post</script><script>alert('XSS')</script>"
}
```

If inserted directly into an HTML template using `JSON.stringify()`:

```html
<!-- ❌ DANGEROUS: The HTML parser stops reading at the first </script> -->
<script type="application/ld+json">
{"headline":"A great post</script><script>alert('XSS')</script>"}
</script>
```

The browser's HTML parser closes the LD+JSON block at `</script>` and immediately executes the injected `<script>` tag.

---

## 2. Unicode anti-XSS escaping

The `serializeJsonLd()` function—used by `<Schema />` in both Astro and Svelte—escapes sensitive characters into standard JSON Unicode sequences:

| Sensitive Character | Sanitized Unicode Form | Protection Provided |
| --- | --- | --- |
| `<` | `\u003c` | Prevents opening `</script>` or `<script>` tags |
| `>` | `\u003e` | Prevents HTML tag termination |
| `&` | `\u0026` | Prevents entity confusion |
| `\u2028` (Line Separator) | `\u2028` | Fixes JavaScript parsing issues in legacy engines |
| `\u2029` (Paragraph Separator) | `\u2029` | Fixes JavaScript parsing issues in legacy engines |

### Safe HTML Output

When serialized with `unschema-graph`:

```html
<!-- ✅ SAFE: HTML parser sees pure text without any tag delimiters -->
<script type="application/ld+json">
{"headline":"A great post\u003c/script\u003e\u003cscript\u003ealert('XSS')\u003c/script\u003e"}
</script>
```

JSON parsers decode `\u003c` back to `<` while the HTML parser never sees a literal tag delimiter.

---

## 3. Trust boundaries and CMS payloads

TypeScript types only exist at compile time. External CMS APIs or database responses can return unexpected shapes or missing required fields.

To safeguard your build:

1. **Use `builder.safeParse()` for untrusted endpoints:**
   ```ts
   const result = Article.safeParse(cmsPayload);
   if (!result.success) {
     console.error('Schema rejected:', result.error.message);
   }
   ```
2. **Set `onError: 'throw'` in production builds:**
   Catch invalid schema structures during CI before broken SEO metadata reaches search engines.

---

## 4. Controlled extension with `withAdditionalProperties()`

When you need custom Schema.org properties not present in the typed builders, use `withAdditionalProperties()`:

```ts
import { Article, withAdditionalProperties } from '@unschema-graph/core';

const article = withAdditionalProperties(
  Article({
    headline: 'Secure Structured Data',
    image: 'https://example.com/cover.jpg',
    datePublished: 'today',
    author: 'Ada Lovelace',
  }),
  {
    customTrackingId: 'xyz-123',
  }
);
```

`withAdditionalProperties()` strictly prevents overriding core `@type` or `@id` values.

## Production checklist

- Treat CMS, API, database and user-authored values as untrusted at runtime.
- Parse uncertain payloads with `safeParse()` before they reach a page component.
- Keep `onError: 'throw'` for production builds and CI.
- Extend a validated entity only through `withAdditionalProperties()` or
  `withAdditionalTypes()`; never spread an unchecked payload into JSON-LD.
- Build the final site and run the audit CLI against the emitted HTML.
- Review the rendered structured data whenever the CMS model or mapping changes.

Next: use the [audit CLI](/audit-and-quality/audit-cli/) to inspect the compiled HTML,
open the [troubleshooting guide](/operations/troubleshooting/), or review
[known limitations](/operations/known-limitations/).
