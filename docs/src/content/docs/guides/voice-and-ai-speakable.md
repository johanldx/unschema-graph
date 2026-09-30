---
title: Speakable and SearchAction
description: Generate Schema.org SpeakableSpecification and SearchAction structures and understand their current platform support.
---

`unschema-graph` includes helpers for the Schema.org `SpeakableSpecification` and `SearchAction` types. These helpers validate and normalize markup; they do not guarantee that a search engine, assistant, or AI system will use it.

---

## 1. Speakable Specification

The `speakable` property identifies sections of a page that are suitable for text-to-speech. Google's related search feature remains a limited beta with its own eligibility rules, availability, and no display guarantee. See the [current Google Search documentation](https://developers.google.com/search/docs/appearance/structured-data/speakable) before relying on it.

`unschema-graph` accepts convenient CSS selector shorthands that are automatically transformed into standard `SpeakableSpecification` objects.

### Single CSS Selector Shorthand

```ts
import { Article } from '@unschema-graph/core';

const article = Article({
  headline: 'AI Trends in 2026',
  image: 'https://example.com/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  // Single string selector
  speakable: '.lead-summary',
});
```

Generated output:
```json
{
  "@type": "Article",
  "headline": "AI Trends in 2026",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".lead-summary"]
  }
}
```

### Multiple CSS Selectors

Pass an array of selectors matching the key audio passages on your page:

```ts
const article = Article({
  headline: 'AI Trends in 2026',
  image: 'https://example.com/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  speakable: ['h1.headline', '.summary-paragraph', '#takeaways'],
});
```

### Advanced XPath Selectors

You can also pass a full `SpeakableSpecification` object containing `xpath` expressions:

```ts
const article = Article({
  headline: 'AI Trends in 2026',
  image: 'https://example.com/cover.jpg',
  datePublished: 'today',
  author: 'Ada Lovelace',
  speakable: {
    '@type': 'SpeakableSpecification',
    xpath: ['/html/head/title', '/html/body/main/article/p[1]'],
  },
});
```

---

## 2. Schema.org `SearchAction`

`SearchAction` describes a search operation in Schema.org. Google removed the Sitelinks Searchbox visual feature from Search in November 2024, so this markup must not be presented as enabling that feature. See [Google's deprecation notice](https://developers.google.com/search/blog/2024/10/sitelinks-search-box).

`unschema-graph` automates this via the `searchUrl` shorthand property or the standalone `createSearchAction` helper:

### Automatic SearchAction via `WebSite`

```ts
import { WebSite } from '@unschema-graph/core';

const site = WebSite({
  '@id': '#website',
  name: 'Acme News',
  url: 'https://example.com',
  // Shorthand with template variable:
  searchUrl: 'https://example.com/search?q={search_term_string}',
});
```

Generated output:
```json
{
  "@type": "WebSite",
  "@id": "https://example.com/#website",
  "name": "Acme News",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### Programmatic `createSearchAction` Helper

You can also construct custom search actions independently:

```ts
import { createSearchAction } from '@unschema-graph/core';

const action = createSearchAction({
  urlTemplate: 'https://example.com/search?query={q}',
  queryInput: 'required name=q',
});
```
