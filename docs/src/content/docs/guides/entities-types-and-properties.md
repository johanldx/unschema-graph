---
title: Entities, types, and properties
description: Distinguish TypeScript types, Schema.org @type values, Zod schemas, and builder properties.
---

The word “type” appears at several layers. Keeping those layers separate makes errors
easier to understand.

## TypeScript types

TypeScript checks the code available to the compiler. It catches unknown property names
and incompatible values while you edit or build the project.

```ts
Article({
  headline: 'A typed article',
  datePublised: '2026-09-29', // TypeScript reports the misspelling
});
```

TypeScript disappears after compilation. It cannot prove that data received from a CMS
matches the declared type.

## Schema.org `@type`

`@type` names the kind of entity represented in JSON-LD, such as `Article`, `Person`,
or `Organization`. The builder owns this value:

```ts
const article = Article({
  headline: 'A typed article',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});

article['@type']; // 'Article'
```

Do not pass `@type` to a builder. Use a different builder or
`withAdditionalTypes()` when one entity legitimately has more than one type.

## Zod schemas

Each builder wraps a strict Zod schema. Zod runs when the builder is called, so it can
reject malformed CMS, API, or frontmatter data.

```ts
const result = Article.safeParse(cmsPayload);

if (!result.success) {
  console.error(result.error.details);
}
```

“Valid” here means valid for the properties modeled by that builder. It is not a
promise that an external platform will display the entity.

## Required and optional properties

Every builder reference lists required and optional inputs. For example, `Article`
requires `headline`, `image`, `datePublished`, and `author`; `publisher` and
`description` are optional in the builder.

Use the [builder catalog](/reference/builders/) as the source of truth instead of
guessing property names from another entity type.

## Nested values and references

A property may accept a string shorthand, an embedded entity, an `@id` reference, or an
array. Its builder reference states the accepted forms. Prefer a reference when the
same entity is shared by several graph nodes; embed a value when it only belongs to its
parent.

Next: learn [how stable identities work](/guides/identities/).
