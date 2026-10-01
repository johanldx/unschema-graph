# @unschema-graph/astro

[![npm version](https://img.shields.io/npm/v/@unschema-graph/astro.svg)](https://www.npmjs.com/package/@unschema-graph/astro)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

Astro integration, `<Schema />` component (0 KB client JS), Content Collections helpers, and Dev Toolbar inspector for `unschema-graph`.

All 51 typed Schema.org builders from `@unschema-graph/core` are re-exported directly from `@unschema-graph/astro`.

---

## Installation

```bash
# pnpm
pnpm add @unschema-graph/astro zod

# npm
npm install @unschema-graph/astro zod

# yarn
yarn add @unschema-graph/astro zod

# bun
bun add @unschema-graph/astro zod
```

---

## Configuration

Add the integration in `astro.config.mjs` to enable automatic `baseUrl` inference from Astro's `site` setting, Dev Toolbar inspection, and build-time error policies:

```javascript
// astro.config.mjs
import schemaGraph from '@unschema-graph/astro/integration';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    schemaGraph({
      // Throw on validation errors in production/CI, warn during dev
      onError: process.env.NODE_ENV === 'production' ? 'throw' : 'warn',
    }),
  ],
});
```

---

## Usage

### In an Astro page or layout

```astro
---
// src/pages/blog/[slug].astro
import {
  Article,
  BreadcrumbList,
  Organization,
  Schema,
} from '@unschema-graph/astro';

const { post } = Astro.props;

const publisher = Organization({
  '@id': '#organization',
  name: 'Acme Media',
  url: 'https://example.com',
});

const article = Article({
  '@id': '#article',
  headline: post.data.title,
  image: post.data.coverImage,
  datePublished: post.data.publishedAt,
  author: post.data.author,
  publisher: '#organization',
});

const breadcrumbs = BreadcrumbList({
  itemListElement: [
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
    { name: post.data.title },
  ],
});
---

<head>
  <title>{post.data.title}</title>
  <!-- Injects a single unified, deduplicated, anti-XSS escaped @graph script -->
  <Schema items={[publisher, article, breadcrumbs]} />
</head>
```

### Content Collections Helpers

Transform Astro Content Collections entries into validated Schema.org entities:

```typescript
import { toBlogPosting } from '@unschema-graph/astro/content';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const blogPosting = toBlogPosting(posts[0], {
  publisher: '#organization',
});
```

---

## Compatibility

| Dependency | Supported Range | Notes |
| :--- | :--- | :--- |
| **Astro** | `^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0` | Server-rendered and static output. Component adds 0 KB client JS. |
| **Node.js** | `>=22.12.0` | Oldest maintained LTS baseline tested in CI. |
| **Zod** | `^4.6.0` | Peer dependency for schema validation. |

---

## Documentation

- [Astro Quick Start](https://unschema-graph.jhdx.dev/getting-started/quick-start/astro/)
- [Astro Integration Reference](https://unschema-graph.jhdx.dev/integrations/astro/)
- [Content Collections Guide](https://unschema-graph.jhdx.dev/guides/content-collections/)
- [51 Supported Builders](https://unschema-graph.jhdx.dev/reference/builders/)
- [Audit CLI & CI/CD](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)
- [Troubleshooting](https://unschema-graph.jhdx.dev/operations/troubleshooting/)

---

## License

MIT © [Johan Ledoux](https://github.com/johanldx)
