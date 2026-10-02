# unschema-graph

<p align="center">
  <img src="https://raw.githubusercontent.com/johanldx/unschema-graph/main/docs/public/favicon.svg" alt="unschema-graph logo" width="96" height="96" />
</p>

<h3 align="center">The Type-Safe Schema.org Knowledge Graph Engine</h3>

<p align="center">
  <strong>Compose typed Schema.org entities, validate them with Zod, interconnect them into a unified <code>@graph</code>, and serialize safely for modern web frameworks.</strong>
</p>

<p align="center">
  <a href="https://github.com/johanldx/unschema-graph/releases"><img src="https://img.shields.io/badge/version-v0.10.0_(API_freeze)-6366f1.svg?style=flat-square" alt="Version 0.10.0" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/core"><img src="https://img.shields.io/npm/v/@unschema-graph/core?color=6366f1&label=%40unschema-graph%2Fcore&style=flat-square" alt="Core npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/astro"><img src="https://img.shields.io/npm/v/@unschema-graph/astro?color=f97316&label=%40unschema-graph%2Fastro&style=flat-square" alt="Astro npm version" /></a>
  <a href="https://www.npmjs.com/package/@unschema-graph/svelte"><img src="https://img.shields.io/npm/v/@unschema-graph/svelte?color=ff3e00&label=%40unschema-graph%2Fsvelte&style=flat-square" alt="Svelte npm version" /></a>
  <a href="https://unschema-graph.jhdx.dev/"><img src="https://img.shields.io/badge/Documentation-unschema--graph.jhdx.dev-8b5cf6.svg?style=flat-square" alt="Documentation" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Made%20in-France%20%F0%9F%87%AB%F0%9F%87%B7-0055A5?style=flat-square" alt="Made in France" />
</p>

---

## 🎯 What is unschema-graph?

Schema.org JSON-LD gives search engines (Google, Bing) and AI crawlers (Perplexity, ChatGPT Search) machine-readable information about the entities and relationships on a page. Search platforms may use structured data for enhanced features such as Rich Results (Articles, Products, Events, FAQs, Reviews, Breadcrumbs), but valid markup alone does not guarantee eligibility or display.

However, writing JSON-LD by hand or using basic type definitions is error-prone:
- ❌ **Silent validation failures:** A typo like `publsher` or a missing required property can invalidate your structured data without any warning during development or build time.
- ❌ **Fragmented data silos:** Managing entities across independent JSON-LD blocks makes identity reuse, deduplication, and explicit relationships harder to maintain across your authors, articles, organization, and products.
- ❌ **Subtle XSS vulnerabilities:** Using standard `JSON.stringify()` in HTML templates exposes your site to script breakout injections whenever untrusted user or CMS content contains `</script>`.

**`unschema-graph` provides a typed and validated workflow for the parts it models.** It offers **51 Schema.org builders** validated at runtime by **Zod**, an automatic relational engine that resolves `#id` references into a **single, unified `@graph`**, and native components for **Astro**, **Svelte 5**, and **vanilla TypeScript**.

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
| **Client Bundle Overhead** | 0 kB | 0 kB | 0–15 kB | **Astro: 0 kB / Svelte: native runtime** |

---

## ⚡ Quick Example: Direct Entity Graphing

Create fully validated, interconnected structured data with zero boilerplate:

```ts
import { Article, Organization, buildJsonLdGraph, serializeJsonLd } from '@unschema-graph/core';

// 1. Declare typed entities — reference other entities directly as objects!
const publisher = Organization({
  '@id': '#organization',
  name: 'Acme Media',
  url: 'https://example.com'
});

const article = Article({
  headline: 'Building Modern Search-Optimized Web Apps',
  description: 'How to structure JSON-LD data for search engines and AI agents.',
  author: 'Johan Ledoux',
  publisher, // 👈 Directly pass the entity object! (Or use '#organization' fragment)
});

// 2. buildJsonLdGraph crawls connected entities, hoists them, and builds a clean @graph
const graph = buildJsonLdGraph(article, { baseUrl: 'https://example.com' });
const jsonLd = serializeJsonLd(graph, { pretty: true });
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

## 🚀 Key Advantages in Version 0.10.0

`unschema-graph` **v0.10.0** freezes the intended public API surface ahead of `1.0.0-rc.1`, while preserving the stabilized graph, validation, serialization, Astro and Svelte behavior introduced during the 0.9 cycle.

### 1. 🛡️ 51 Schema.org Builders Powered by Zod
The curated builder catalog targets the Schema.org 30.1 vocabulary baseline and validates inputs synchronously. Explicitly named profiles such as `GoogleArticle` and `GoogleRecipe` add library-maintained Google constraints without implying rich-result eligibility.

### 2. 🕸️ Relational Graph Engine (`@graph`)
Connected knowledge graphs make relationships explicit. Pass entities directly as nested objects (`publisher: organization`) or reference them via `#id` fragments. `unschema-graph` automatically crawls the object graph, hoists shared nodes to the top level, resolves relative `#id` fragments against your canonical `baseUrl`, and merges duplicate entities deterministically into a single `@graph`.

Relationship strings are explicit: fragments, paths, and absolute URIs become `@id`
references. Plain names expand only when the relationship defines an unambiguous fallback type;
otherwise, pass a typed entity or an explicit `@id` reference.

### 3. 🔒 Zero-Trust Anti-XSS Protection
Never inject unescaped JSON into your HTML. Our serializer substitutes `<` and `>` with Unicode escapes (`\u003c`, `\u003e`), guaranteeing that untrusted CMS fields or comments cannot break out of `<script>` blocks or execute arbitrary JavaScript.

### 4. 🪶 Server-First Rendering with Zero Client JS in Astro
Structured data is processed server-side or during static build. In Astro, the `<Schema />` component renders static HTML with no client directive and adds **0 kB** of client JavaScript. Core has no client runtime requirement when used during build/SSR. In Svelte, the component integrates with native reactivity and participates in standard hydration and client-side navigation.

### 5. 🔍 Built-in CI/CD Audit CLI
Run `npx @unschema-graph/core audit dist` in your deployment pipeline. The CLI discovers generated HTML files, extracts JSON-LD blocks, checks graph integrity, detects broken local references, duplicate IDs, and structural conflicts before deployment. In this repository, `pnpm run audit` is the warning-friendly development check, while CI and `pnpm run release:check` use `pnpm run audit:strict` so every warning blocks publication.

### 6. 🛠️ Astro Dev Toolbar & Svelte 5 Runes
- **Astro:** Zero-configuration `<Schema />` component, automatic canonical URL resolution from `astro.config.mjs`, and an interactive **Dev Toolbar** app to inspect entities directly in your browser.
- **Svelte 5:** Native reactive component designed with Svelte 5 runes (`$props`, `$derived`), rendering directly into `<svelte:head>`.

---

## 📦 Framework Packages

| Package | Environment | Purpose |
| :--- | :--- | :--- |
| **[`@unschema-graph/core`](https://unschema-graph.jhdx.dev/getting-started/quick-start/core/)** | Node >=22.12; browser-safe root; Bun/Deno best-effort | Framework-neutral engine; Node-only audit CLI/API |
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
