---
title: Configuration
description: Complete integration, builder, graph, and component configuration reference.
---

## Integration options

```ts
interface SchemaGraphOptions {
  onError?: 'throw' | 'warn' | 'silent';
  baseUrl?: string;
}
```

| Option | Default | Description |
| --- | --- | --- |
| `onError` | `throw` for build, `warn` otherwise | Global builder validation behavior. |
| `baseUrl` | Astro `site` | Canonical origin for relative identifiers and URLs. |

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
tests. Application code should normally configure behavior through `schemaGraph()` rather than
mutating the module-level configuration directly.

## Resolution precedence

| Setting | Highest to lowest priority |
| --- | --- |
| Validation severity | builder call → integration → `throw` |
| Base URL while rendering | component prop → `Astro.site` → integration |
| Entity language | existing entity value → component prop → `Astro.currentLocale` |
