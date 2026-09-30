---
title: Audit en CI
description: Faire échouer un déploiement lorsque le HTML généré contient un JSON-LD mal formé ou invalide.
---

## Objectif

Faire échouer un déploiement lorsque le HTML généré contient un JSON-LD mal formé ou invalide.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Article`](/fr/reference/builders/article/).

## Graphe recommandé

1. `Article` — nœud principal

## Exemple minimal

```ts
import { Article } from '@unschema-graph/core';

const entity = Article({
  "headline": "Structured data with Astro",
  "image": "/images/structured-data.jpg",
  "datePublished": "2026-09-29",
  "author": "Ada Lovelace"
});
```

## Exemple de production

Compilez d’abord, auditez le vrai dossier de sortie, conservez le code de sortie et archivez le build pour le diagnostic.

```ts
const result = Article.safeParse(cmsData);
if (!result.success) {
  throw new Error(result.error.issues.map((issue) => issue.message).join('\n'));
}

const graph = buildJsonLdGraph([result.data], { baseUrl: 'https://example.com' });
```

## Variantes par environnement

| Astro | Svelte 5 / SvelteKit | Core |
| --- | --- | --- |
| `<Schema items={items} />` | `<Schema items={items} />` | `serializeJsonLd(buildJsonLdGraph(items))` |

## GitHub Actions

```yaml
- run: pnpm run build
- run: pnpm exec unschema-graph audit dist
```

La commande renvoie `0` si tout est valide et un code non nul si des erreurs sont trouvées.

## Erreurs fréquentes et diagnostic

1. **Auditer les templates au lieu du HTML construit.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Viser le mauvais dossier de sortie.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Masquer un code de sortie non nul dans un pipeline shell.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Documentation liée](/fr/audit-and-quality/audit-cli/).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
