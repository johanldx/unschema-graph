---
title: Mental model
description: Understand how source data becomes validated Schema.org entities, a connected graph, and safe JSON-LD.
---

unschema-graph has four concepts: a **builder** validates input, an **entity** describes
one thing, an **identity** lets other entities point to that thing, and a **graph**
collects the connected entities in one JSON-LD document.

## From input to HTML

```text
page or CMS data
      ↓
Article({ ... })          builder validates the input
      ↓
{ "@type": "Article" }   entity with a Schema.org type
      ↓
buildJsonLdGraph(items)   identities are resolved and duplicate nodes merge
      ↓
serializeJsonLd(payload)  HTML-sensitive characters are escaped
      ↓
<script type="application/ld+json">
```

Astro and Svelte run the final two steps inside `<Schema />`. Core exposes the same
steps directly.

## Builder

A builder is a callable, typed validator such as `Article`, `Organization`, or
`Product`. It owns the final `@type`; you provide the properties for that type.

```ts
import { Article } from '@unschema-graph/core';

const article = Article({
  headline: 'Connected structured data',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
});
```

TypeScript checks code you write. Zod validates the data when the builder runs, which
also covers values loaded from a CMS or API.

## Entity and identity

The value returned by a builder is an entity. Add `@id` when that entity must be
referenced from another node or reused across pages.

```ts
const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
  url: 'https://example.com',
});

const article = Article({
  headline: 'Connected structured data',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
});
```

`publisher: '#organization'` becomes an `@id` reference instead of a second embedded
copy of the organization.

## A realistic page graph

One page can describe the site, publisher, page, and article together:

```ts
import {
  Article,
  Organization,
  WebPage,
  WebSite,
  buildJsonLdGraph,
} from '@unschema-graph/core';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme Publishing',
  url: 'https://example.com',
});

const website = WebSite({
  '@id': '#website',
  name: 'Acme Journal',
  url: 'https://example.com',
  publisher: '#organization',
});

const page = WebPage({
  '@id': '/articles/graph#webpage',
  name: 'Connected structured data',
  url: '/articles/graph',
  isPartOf: '#website',
});

const article = Article({
  '@id': '/articles/graph#article',
  headline: 'Connected structured data',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher: '#organization',
  mainEntityOfPage: '/articles/graph#webpage',
});

const graph = buildJsonLdGraph([organization, website, page, article], {
  baseUrl: 'https://example.com',
});
```

The graph contains four nodes. Their relative identities become absolute, and
references point to the corresponding nodes without duplicating their properties.

## What the library guarantees

unschema-graph validates the properties modeled by each builder, composes the graph,
and safely serializes JSON-LD for HTML. It does not guarantee that a search engine will
display a rich result or that a platform will consume a particular property.

Next: learn [how types and properties are validated](/guides/entities-types-and-properties/).
