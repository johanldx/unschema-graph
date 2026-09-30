---
title: Migrations
description: État actuel des migrations et procédure sûre de mise à niveau avant la version 1.0.
---

Aucune migration n’est actuellement requise : tous les packages appartiennent à la
première série `0.1.x`.

Avant `1.0`, épinglez les versions et consultez les
[Changesets](https://github.com/johanldx/unschema-graph/tree/main/.changeset) avant une mise à jour.
Mettez Core, Astro et Svelte à niveau ensemble puisqu’ils sont publiés comme groupe fixe.

## Procédure de mise à niveau

1. Lisez les Changesets en attente ou publiés.
2. Mettez tous les packages `@unschema-graph/*` à la même version.
3. Lancez typecheck et tests.
4. Construisez le site puis auditez son vrai dossier de sortie.
5. Inspectez une page représentative de chaque famille d’entités utilisée.

Les futures ruptures ajouteront des sections propres à chaque version sur cette page.
