---
title: Choose your environment
description: Pick the unschema-graph package that matches Astro, Svelte 5, or a framework-neutral TypeScript project.
---

All three packages use the same builders and produce the same JSON-LD. Choose the
package responsible for rendering your HTML; you can move shared entity-building code
to Core later without rewriting it.

## Choose Astro

Use `@unschema-graph/astro` for an Astro site. It includes:

- the `<Schema />` component;
- the `schemaGraph()` integration and development toolbar;
- Content Collections helpers;
- every Core builder and utility.

Choose Astro when you want the integration to derive locale and
canonical-site information from Astro itself.

[Build your first schema with Astro](/getting-started/quick-start/astro/)

## Choose Svelte

Use `@unschema-graph/svelte` for Svelte 5 or SvelteKit. It includes a reactive
`<Schema />` component that renders through `<svelte:head>` and re-exports the complete
Core API.

[Build your first schema with Svelte](/getting-started/quick-start/svelte/)

## Choose Core

Use `@unschema-graph/core` for Node.js, scripts, custom renderers, or frameworks without
a dedicated adapter. Core builds, validates, links, and serializes entities; your
application decides where to place the resulting script.

[Build your first schema with Core](/getting-started/quick-start/core/)

## Not sure?

Choose the framework adapter when one exists. Choose Core when you need complete
control over rendering or want to share schema construction in framework-neutral code.

Next: [install the selected package](/getting-started/installation/).
