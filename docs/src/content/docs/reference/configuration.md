---
title: Configuration
description: Complete integration, builder, graph, and component configuration reference.
---

## Integration options

```ts
interface SchemaGraphOptions {
  onError?: 'throw' | 'warn' | 'silent';
  baseUrl?: string;
  inLanguage?: string;
}
```

| Option | Default | Description |
| --- | --- | --- |
| `onError` | `throw` for build, `warn` otherwise | Global builder validation behavior. |
| `baseUrl` | Astro `site` | Canonical origin for relative identifiers and URLs. |
| `inLanguage` | `undefined` | Default BCP-47 language tag used after any Astro route locale. |

```js
schemaGraph({
  onError: 'throw',
  baseUrl: 'https://example.com',
})
```

## Per-builder options

Every builder accepts an optional second argument:

```ts
interface ValidationOptions {
  entityType?: string;
  onError?: 'throw' | 'warn' | 'silent';
}
```

`onError` overrides the integration setting. `entityType` is mainly useful with low-level validation
or custom builders; built-in builders already set it.

## Graph options

```ts
interface GraphOptions {
  graph?: boolean;   // default: true
  context?: string;  // default: https://schema.org
  baseUrl?: string;
  duplicateStrategy?: 'merge' | 'error' | 'first' | 'last'; // default: merge
  onDiagnostic?: (diagnostic: GraphDiagnostic) => void;
}
```

These options are accepted by `buildJsonLdGraph()`. The default `merge` strategy keeps
complementary properties and lets the latest conflicting value win. Diagnostics are structured and
opt-in through `onDiagnostic`; the collector does not write to the console.

## Serialization options

```ts
interface SerializeOptions {
  pretty?: boolean; // default: false
  indent?: number;  // default: 2
}
```

## Global configuration helpers

`getGlobalConfig()`, `setGlobalConfig()`, and `resetGlobalConfig()` are exported for tooling and
tests. This is mutable module-level convenience state, not a request-scoped configuration object.
Application code should normally configure it once through `schemaGraph()` rather than mutate it
directly. Builders read its validation default, and framework components read its URL and language
defaults. `buildJsonLdGraph()` does not read it implicitly: pass graph options explicitly whenever
the result must be independent of adapter state.

## Resolution precedence

| Setting | Highest to lowest priority |
| --- | --- |
| Validation severity | builder call → integration → `throw` |
| Base URL in Astro | component prop → integration/global default → `Astro.site` fallback |
| Entity language in Astro | existing entity value → component prop → `Astro.currentLocale` → integration/global default |
| Base URL in Svelte | component prop → global default |
| Entity language in Svelte | existing entity value → component prop → global default |
| Core graph options | explicit `buildJsonLdGraph()` options only |
