---
title: Core dans tout framework
description: Utiliser le moteur universel lorsqu’aucune intégration de rendu dédiée n’existe.
---

## Objectif

Utiliser le moteur universel lorsqu’aucune intégration de rendu dédiée n’existe.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Article`](/fr/reference/builders/article/), [`Organization`](/fr/reference/builders/organization/).

## Graphe recommandé

1. `Article` — nœud principal
2. `Organization`

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

Construisez et sérialisez côté serveur, puis placez la chaîne dans un script application/ld+json sans la parser et la sérialiser à nouveau.

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

## Erreurs fréquentes et diagnostic

1. **Importer le point d’entrée Node de l’audit dans le navigateur.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Sérialiser avec JSON.stringify directement dans le HTML.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Oublier baseUrl pour résoudre les identifiants relatifs.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Documentation liée](/fr/integrations/core/).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
