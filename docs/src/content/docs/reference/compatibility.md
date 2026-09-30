---
title: Compatibility matrix
description: Runtime and peer-dependency support derived from the package manifests.
---

This matrix reflects the published package manifests, not an aspirational roadmap.

| Surface | Supported range | Rendering model | Notes |
| --- | --- | --- | --- |
| Core | Node `>=22.12.0`, Zod `^4.6.0` | Framework-neutral | Browser-safe root export; `core/audit` is Node-only. |
| Astro | Astro `^5.0.0 || ^6.0.0 || ^7.0.0`, Node `>=22.12.0` | Static and SSR | Component adds no client JavaScript. Integration supplies build/dev defaults. |
| Svelte | Svelte `^5.0.0`, Node `>=22.12.0` for tooling | SSR and reactive client navigation | Native runes component using `svelte:head`. |
| SvelteKit | Svelte 5-compatible releases | SSR, prerendering, client navigation | No separate adapter; use the Svelte package. |
| Zod | `^4.6.0` | Runtime validation | Peer dependency of Core. |

The repository currently tests with Astro 7.3, Svelte 5, TypeScript 6 and Zod 4.6.
That records the development environment; peer ranges above define package acceptance.

See the [Astro integration](/integrations/astro/), [Svelte integration](/integrations/svelte/),
and [Core integration](/integrations/core/).
