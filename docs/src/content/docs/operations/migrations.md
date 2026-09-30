---
title: Migrations
description: Current migration status and the safe upgrade workflow for pre-1.0 releases.
---

No migration is currently required: all packages are on the initial `0.1.x` release line.

Before `1.0`, pin package versions and review the repository’s
[Changesets](https://github.com/johanldx/unschema-graph/tree/main/.changeset) before upgrading.
Upgrade Core, Astro, and Svelte packages together because they are released as a fixed group.

## Upgrade workflow

1. Read pending/published Changesets.
2. Update all installed `@unschema-graph/*` packages to the same version.
3. Run typecheck and tests.
4. Build the production site and run the audit CLI against its real output directory.
5. Inspect one representative page for every entity family you use.

Future breaking changes will add version-specific sections to this page.
