# @unschema-graph/core

[![npm version](https://img.shields.io/npm/v/@unschema-graph/core.svg)](https://www.npmjs.com/package/@unschema-graph/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)

Framework-independent Schema.org JSON-LD builders, runtime Zod validation, `@graph` resolution, Unicode anti-XSS serialization, duration parsing, and static HTML auditing.

`@unschema-graph/core` is the engine behind `@unschema-graph/astro` and `@unschema-graph/svelte`. It can also be used directly in any Node.js, Bun, Deno, or front-end application.

---

## Installation

```bash
# pnpm
pnpm add @unschema-graph/core zod

# npm
npm install @unschema-graph/core zod

# yarn
yarn add @unschema-graph/core zod

# bun
bun add @unschema-graph/core zod
```

---

## Usage

### 1. Build and validate Schema.org entities

```typescript
import { Article, Organization, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

// 1. Build entities with official typed builders
const publisher = Organization({
  '@id': '#organization',
  name: 'Acme Corp',
  url: 'https://example.com',
});

const article = Article({
  '@id': '#article',
  headline: 'Core TypeScript Structured Data',
  image: 'https://example.com/cover.jpg',
  datePublished: '2026-09-29',
  author: 'Ada Lovelace',
  publisher, // Typed entity-object reference!
});

// 2. Resolve references and deduplicate under a single @graph via automatic discovery
const graph = buildJsonLdGraph(article, {
  baseUrl: 'https://example.com',
});

// 3. Serialize safely into JSON-LD (recommended for <script type="application/ld+json"> injection)
const jsonString = serializeJsonLd(graph);
```

Relationship strings that look like fragments, paths, or absolute URIs become `@id`
references. A plain name such as `author: 'Ada Lovelace'` expands only when that relationship
defines a fallback type. Generic relationships without a fallback require a typed entity or an
explicit reference such as `'#person'` or `{ '@id': '#person' }`.

### 2. Runtime validation with `safeParse`

Validate untrusted external data (such as CMS responses or API payloads) before rendering:

```typescript
const result = Article.safeParse(untrustedCmsData);

if (result.success) {
  const validatedArticle = result.data;
} else {
  console.error('Invalid structured data:', result.error.format());
}
```

---

## Static Build Audit CLI

The package provides a built-in static audit CLI to inspect built HTML files (in `dist/` or `build/`):

```bash
npx @unschema-graph/core audit dist
```

You can also import the Node-only audit API directly in scripts:

```typescript
import { auditHtmlDirectory } from '@unschema-graph/core/audit';

const report = auditHtmlDirectory('./dist');
console.log(`Scanned ${report.scannedFiles} HTML files with ${report.errors.length} errors.`);
```

---

## Compatibility

| Environment | Supported Range | Notes |
| :--- | :--- | :--- |
| **Node.js** | `>=22.12.0` | Oldest maintained LTS baseline tested in CI; required for tooling and `@unschema-graph/core/audit`. |
| **Zod** | `^4.6.0` | Peer dependency for runtime validation. |
| **TypeScript** | `>=5.0` | Strict mode recommended. |
| **Browser** | Modern browsers | Root export is pure TypeScript/JavaScript with zero Node built-ins. |

Built-in schemas model a curated subset of the Schema.org `30.1` vocabulary baseline;
this is not a claim of complete vocabulary or Google rich-result coverage.

---

## Documentation

- [Core Quick Start](https://unschema-graph.jhdx.dev/getting-started/quick-start/core/)
- [Architecture Pipeline](https://unschema-graph.jhdx.dev/architecture/pipeline/)
- [Mental Model & Graph Resolution](https://unschema-graph.jhdx.dev/guides/mental-model/)
- [51 Supported Builders](https://unschema-graph.jhdx.dev/reference/builders/)
- [Audit CLI & CI/CD](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)
- [Troubleshooting](https://unschema-graph.jhdx.dev/operations/troubleshooting/)

---

## License

MIT © [Johan Ledoux](https://github.com/johanldx)
