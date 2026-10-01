# unschema-graph

<p align="center">
  <img src="https://raw.githubusercontent.com/johanldx/unschema-graph/main/docs/public/favicon.svg" alt="unschema-graph logo" width="96" height="96" />
</p>

<h3 align="center">The Type-Safe Schema.org Knowledge Graph Engine</h3>

<p align="center">
  <strong>Compose typed Schema.org entities, validate them with Zod, interconnect them into a unified <code>@graph</code>, and serialize safely for modern web frameworks.</strong>
</p>

<p align="center">
  <a href="https://github.com/johanldx/unschema-graph/releases"><img src="https://img.shields.io/badge/version-v0.9.0_(RC_v1)-6366f1.svg?style=flat-square" alt="Version 0.9.0" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/core"><img src="https://img.shields.io/npm/v/@unschema-graph/core?color=6366f1&label=%40unschema-graph%2Fcore&style=flat-square" alt="Core npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/astro"><img src="https://img.shields.io/npm/v/@unschema-graph/astro?color=f97316&label=%40unschema-graph%2Fastro&style=flat-square" alt="Astro npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/svelte"><img src="https://img.shields.io/npm/v/@unschema-graph/svelte?color=ff3e00&label=%40unschema-graph%2Fsvelte&style=flat-square" alt="Svelte npm version" /></a>
  <a href="https://unschema-graph.jhdx.dev/"><img src="https://img.shields.io/badge/Documentation-unschema--graph.jhdx.dev-8b5cf6.svg?style=flat-square" alt="Documentation" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Made%20in-France%20%F0%9F%87%AB%F0%9F%87%B7-0055A5?style=flat-square" alt="Made in France" />
</p>

---

## 🎯 What is unschema-graph?

Search engines (Google, Bing) and AI search crawlers (Perplexity, ChatGPT Search) rely on **Schema.org JSON-LD** to understand your content, index entities, and award **Rich Results** (Articles, Products, Events, FAQs, Reviews, Breadcrumbs).

However, writing JSON-LD by hand or using basic type definitions is a minefield:
- ❌ **Silent validation failures:** A typo like `publsher` or a missing required property silently disqualifies your page from Google Rich Results without any warning in your build.
- ❌ **Fragmented data silos:** Spitting out multiple disconnected `<script>` tags prevents search engines from understanding relationships between your authors, articles, organization, and products.
- ❌ **Subtle XSS vulnerabilities:** Using standard `JSON.stringify()` in HTML templates exposes your site to script breakout injections whenever untrusted user or CMS content contains `</script>`.

**`unschema-graph` solves this completely.** It provides **51 Schema.org builders** validated at runtime by **Zod**, an automatic relational engine that resolves `#id` references into a **single, unified `@graph`**, and native components for **Astro**, **Svelte 5**, and **vanilla TypeScript**.

---

## ⚖️ How Does It Compare?

| Feature | Raw `<script>` / JSON | `schema-dts` | Generic SEO plugins | **`unschema-graph`** |
| :--- | :---: | :---: | :---: | :---: |
| **Strict TypeScript Autocomplete** | ❌ | ✅ | Partial | **✅ 51 Dedicated Builders** |
| **Runtime Validation (Zod)** | ❌ | ❌ | ❌ | **✅ Catches dynamic / CMS errors** |
| **Unified `@graph` Engine** | Manual | ❌ | ❌ | **✅ Automatic `#id` deduplication** |
| **Zero-Trust Anti-XSS Escaping** | ❌ | ❌ | Partial | **✅ Escapes `</script>` & `<!--`** |
| **Astro Dev Toolbar Inspector** | ❌ | ❌ | ❌ | **✅ Live in-browser debug panel** |
| **Svelte 5 Runes Integration** | ❌ | ❌ | ❌ | **✅ Reactive `$derived` & `$props`** |
| **Static HTML Audit CLI (CI/CD)** | ❌ | ❌ | ❌ | **✅ Zero-setup build verification** |
| **Client Bundle Overhead** | 0 kB | 0 kB | 0–15 kB | **0 kB (100% build-time / SSR)** |

---

## ⚡ Quick Example: 5 Lines to a Connected Graph

Create fully validated, interconnected structured data in seconds:

```ts
import { Article, Organization, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

// 1. Declare your entities with strict TypeScript autocompletion and Zod validation
const publisher = Organization({
  '@id': '#organization',
  name: 'Acme Media',
  url: 'https://example.com'
});

const article = Article({
  headline: 'Building Modern Search-Optimized Web Apps',
  description: 'How to structure JSON-LD data for search engines and AI agents.',
  author: 'Johan Ledoux',
  publisher: '#organization' // Automatically linked and resolved into the graph
});

// 2. Resolve relationships, hoist nodes, and serialize safely for HTML
const jsonLd = serializeJsonLd(buildJsonLdGraph([publisher, article]));
```

### The Output (Clean, Unified, Safe):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Acme Media",
      "url": "https://example.com"
    },
    {
      "@type": "Article",
      "headline": "Building Modern Search-Optimized Web Apps",
      "description": "How to structure JSON-LD data for search engines and AI agents.",
      "author": { "@type": "Person", "name": "Johan Ledoux" },
      "publisher": { "@id": "https://example.com/#organization" }
    }
  ]
}
</script>
```

---

## 🚀 Key Advantages in Version 0.9.0

`unschema-graph` **v0.9.0** is the official **v1 Release Candidate**, delivering the complete hardened architecture:

### 1. 🛡️ 51 Schema.org Builders Powered by Zod
Forget guessing field names or reading outdated specifications. Every builder validates inputs synchronously against Schema.org and Google Search guidelines. Missing an Article's `headline` or an Event's `startDate`? You get an explicit error at build time, not in production.

### 2. 🕸️ Relational Graph Engine (`@graph`)
Search engines love connected knowledge graphs. Define an author or publisher once with an `@id`, reference it anywhere using `#id` fragments, and `unschema-graph` hoists shared nodes and merges duplicates deterministically into a single `@graph`.

### 3. 🔒 Zero-Trust Anti-XSS Protection
Never inject unescaped JSON into your HTML. Our serializer substitutes `<` and `>` with Unicode escapes (`\u003c`, `\u003e`), guaranteeing that untrusted CMS fields or comments cannot break out of `<script>` blocks or execute arbitrary JavaScript.

### 4. 🪶 0 kB Client JavaScript
Structured data is exclusively parsed and rendered at compile time (SSG) or during server-side rendering (SSR). It adds **exactly zero bytes** to your client-side JavaScript bundles.

### 5. 🔍 Built-in CI/CD Audit CLI
Run `npx @unschema-graph/core audit dist` in your deployment pipeline. The CLI crawls your generated HTML, extracts JSON-LD blocks, verifies graph integrity, checks for broken references, and validates Schema.org semantics before you deploy.

### 6. 🛠️ Astro Dev Toolbar & Svelte 5 Runes
- **Astro:** Zero-configuration `<Schema />` component, automatic canonical URL resolution from `astro.config.mjs`, and an interactive **Dev Toolbar** app to inspect entities directly in your browser.
- **Svelte 5:** Native reactive component designed with Svelte 5 runes (`$props`, `$derived`), rendering directly into `<svelte:head>`.

---

## 📦 Framework Packages

| Package | Environment | Purpose |
| :--- | :--- | :--- |
| **[`@unschema-graph/core`](https://unschema-graph.jhdx.dev/getting-started/quick-start/core/)** | Any (Node.js, Deno, Bun, Edge) | Universal engine: 51 Zod builders, graph resolver, serializer, and audit CLI. |
| **[`@unschema-graph/astro`](https://unschema-graph.jhdx.dev/getting-started/quick-start/astro/)** | Astro 5, 6, 7 | Astro integration, `<Schema />` component, Dev Toolbar inspector, Content Collections helpers. |
| **[`@unschema-graph/svelte`](https://unschema-graph.jhdx.dev/getting-started/quick-start/svelte/)** | Svelte 5 & SvelteKit | Native Svelte 5 `<Schema />` component using reactive runes with `<svelte:head>`. |

### Installation

Choose the package for your stack:

```bash
# For Astro projects
pnpm add @unschema-graph/astro zod

# For Svelte 5 / SvelteKit projects
pnpm add @unschema-graph/svelte zod

# For Node.js, Next.js, Nuxt, or custom pipelines
pnpm add @unschema-graph/core zod
```

---

## 📖 Documentation & Interactive Guides

Explore the full documentation at **[unschema-graph.jhdx.dev](https://unschema-graph.jhdx.dev/)**:

- 🚀 **[Quick Start Guide](https://unschema-graph.jhdx.dev/getting-started/overview/)**
- 🧠 **[Mental Model & Graph Architecture](https://unschema-graph.jhdx.dev/guides/mental-model/)**
- 📚 **[Complete Catalog of 51 Schema Builders](https://unschema-graph.jhdx.dev/reference/builders/)**
- 🛡️ **[Security & Anti-XSS Hardening](https://unschema-graph.jhdx.dev/audit-and-quality/security/)**
- 🔍 **[Build Audit CLI Guide](https://unschema-graph.jhdx.dev/audit-and-quality/audit-cli/)**
- 🍳 **Production Recipes:**
  - [Blog & Media Publishing](https://unschema-graph.jhdx.dev/recipes/blog-media/)
  - [E-Commerce & Products](https://unschema-graph.jhdx.dev/recipes/ecommerce/)
  - [Local Businesses & Organizations](https://unschema-graph.jhdx.dev/recipes/local-business/)
  - [Events & Venues](https://unschema-graph.jhdx.dev/recipes/events/)

---

## 🇫🇷 Made in France

`unschema-graph` is proudly designed and engineered in France with precision, strict typings, and a focus on open-web standards.

Contributions and feedback from the community are warmly welcome!

---

## 📄 License

MIT © [Johan Ledoux](https://github.com/johanldx)
