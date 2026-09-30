---
title: Identities with @id
description: Give entities stable identities, resolve relative identifiers, and reference shared graph nodes.
---

`@id` is the identity of an entity, not merely a label for one object in memory. A stable
identity lets several graph nodes refer to the same real-world thing.

## When to add an identity

Add `@id` when an entity is referenced elsewhere, appears on several pages, or must
merge with another partial declaration. Typical shared entities are an organization,
website, author, product, or the current web page.

```ts
const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
});
```

An isolated nested value does not always need an identity.

## Relative and absolute identifiers

Relative identities keep code portable between local, staging, and production sites:

| Input | Meaning with `baseUrl: 'https://example.com'` |
| --- | --- |
| `#organization` | `https://example.com/#organization` |
| `/about#organization` | `https://example.com/about#organization` |
| `/articles/graph#article` | `https://example.com/articles/graph#article` |
| `https://profiles.example/ada` | unchanged absolute identity |
| `urn:isbn:9780000000000` | unchanged URN identity |

Astro resolves from the component prop, then `Astro.site`, then global integration
configuration. Svelte requires the component `baseUrl` prop. Core uses the `baseUrl`
passed to `buildJsonLdGraph()`.

## Reference an existing entity

Identifier-like strings become lightweight references on properties that accept entity
references:

```ts
const website = WebSite({
  '@id': '#website',
  name: 'Acme Journal',
  url: 'https://example.com',
  publisher: '#organization',
});
```

The publisher value becomes `{ "@id": "…/#organization" }` after graph resolution.
The organization properties stay on the organization node.

## Choose durable identities

- Use the canonical origin, not a preview deployment URL.
- Use the same fragment for the same shared entity across pages.
- Give page-specific nodes a path before the fragment.
- Do not reuse one identity for two different real-world things.
- Prefer a descriptive, stable fragment such as `#organization` over a database row ID
  that may change.

## Common mistakes

- Referencing `#person` while the declared identity is `/authors/ada#person`.
- Omitting `baseUrl` in Svelte or Core and expecting relative identities to become
  absolute.
- Embedding a complete organization inside every article instead of referencing one
  shared node.
- Assigning a new identity every time the same organization is constructed.

Next: [compose and deduplicate a complete graph](/guides/graphs-and-references/).
