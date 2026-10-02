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

The value returned by a builder is an entity. An entity can be used in three ways:

1. **Top-level graph node:** Add an `@id` when that entity represents an independent identity (like an `Organization`, `WebSite`, `WebPage`, `Article`, or `Person`).
2. **Entity-object reference:** Pass a builder entity directly to a relation property (such as `publisher: organization` or `isPartOf: website`). TypeScript guarantees property types, and the graph collector automatically hoists the entity into `@graph` while replacing the nested reference with an `{ "@id": "..." }` pointer.
3. **Inline value object:** Entities without `@id` (such as `PostalAddress`, `GeoCoordinates`, `ContactPoint`, or `AggregateRating`) remain nested inline inside their parent entity because they have no independent identity.

You can also use string shorthands like `publisher: '#organization'` or `{ "@id": "#organization" }`, but passing typed entity objects provides compile-time safety and automatic graph discovery.

## The recommended pattern: Automatic graph discovery

Instead of manually maintaining an array of every entity on the page, connect your entities with entity-object references and pass only the root entity to `buildJsonLdGraph`:

```ts
import {
  Organization,
  WebPage,
  WebSite,
  buildJsonLdGraph,
} from '@unschema-graph/core';

const organization = Organization({
  '@id': '#organization',
  name: 'Acme',
  url: 'https://example.com',
});

const website = WebSite({
  '@id': '#website',
  name: 'Acme',
  url: 'https://example.com',
  publisher: organization,
});

const webpage = WebPage({
  '@id': '#webpage',
  name: 'Home',
  isPartOf: website,
});

const graph = buildJsonLdGraph(webpage, {
  baseUrl: 'https://example.com',
});
```

Passing just `webpage` automatically traverses `isPartOf` and `publisher`, discovering `website` and `organization`. The resulting output is a flat, unified `@graph` with canonical IDs:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Acme",
      "url": "https://example.com"
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "name": "Acme",
      "url": "https://example.com",
      "publisher": {
        "@id": "https://example.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/#webpage",
      "name": "Home",
      "isPartOf": {
        "@id": "https://example.com/#website"
      }
    }
  ]
}
```

## Framework integrations

During static build (SSG) or server-side rendering (SSR), the `<Schema />` component executes this pipeline, outputting the sanitized `<script type="application/ld+json">` tag directly into the document `<head>` (adding **0 kB** of client-side JavaScript in Astro):

```astro title="src/pages/index.astro"
---
import { Schema } from '@unschema-graph/astro';
import { webpage } from '../lib/schema';
---
<head>
  <Schema items={webpage} />
</head>
```

## What the library guarantees

unschema-graph validates the properties modeled by each builder, composes the graph,
and safely serializes JSON-LD for HTML. It does not guarantee that a search engine will
display a rich result or that a platform will consume a particular property.

Next: learn [how types and properties are validated](/guides/entities-types-and-properties/) and how [graphs and references](/guides/graphs-and-references/) work.

