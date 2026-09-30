---
title: Blog et média
description: Publier un graphe d’article avec auteur, éditeur, page, image et fil d’Ariane stables.
---

## Objectif

Publier un graphe d’article avec auteur, éditeur, page, image et fil d’Ariane stables.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`Person`](/fr/reference/builders/person/), [`Organization`](/fr/reference/builders/organization/), [`WebPage`](/fr/reference/builders/web-page/), [`ImageObject`](/fr/reference/builders/image-object/), [`BreadcrumbList`](/fr/reference/builders/breadcrumb-list/).

## Graphe recommandé

1. `Article` — nœud principal
2. `BlogPosting`
3. `Person`
4. `Organization`
5. `WebPage`
6. `ImageObject`
7. `BreadcrumbList`

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

Donnez un `@id` absolu ou résolvable à chaque identité réutilisable. Gardez titre, dates, auteur et images identiques au contenu visible.

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

1. **Oublier headline, image, datePublished ou author.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Utiliser un nom de publisher sans référence Organization stable.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Baliser du contenu absent de la page.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Schema.org / official documentation](https://schema.org/Article).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
