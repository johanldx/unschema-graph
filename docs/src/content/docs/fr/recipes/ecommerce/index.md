---
title: E-commerce
description: Représenter un produit achetable avec prix, disponibilité et notes justifiées.
---

## Objectif

Représenter un produit achetable avec prix, disponibilité et notes justifiées.

> **Validation locale** — Les builders rejettent les propriétés inconnues et exposent `safeParse()` pour les données externes.
>
> **Schema.org** — Le vocabulaire décrit le sens des propriétés ; il ne garantit aucun affichage dans un moteur.
>
> **Éligibilité Google** — Les exigences Google sont supplémentaires et peuvent évoluer. Un balisage valide ne garantit jamais un résultat enrichi.

## Prérequis

- Une URL canonique et un `baseUrl` fiables.
- Des données visibles, actuelles et issues de votre source métier.
- Les builders liés: [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Review`](/fr/reference/builders/review/), [`AggregateRating`](/fr/reference/builders/aggregate-rating/).

## Graphe recommandé

1. `Product` — nœud principal
2. `Offer`
3. `AggregateOffer`
4. `Review`
5. `AggregateRating`

## Exemple minimal

```ts
import { Product } from '@unschema-graph/core';

const entity = Product({
  "name": "Mechanical keyboard",
  "sku": "KB-001",
  "brand": "Acme"
});
```

## Exemple de production

Choisissez Offer pour un prix achetable et AggregateOffer pour une vraie fourchette. Synchronisez prix et disponibilité avec la page.

```ts
const result = Product.safeParse(cmsData);
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

1. **Prix ou disponibilité différents du contenu visible.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
2. **Utiliser AggregateOffer pour un prix unique.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.
3. **Publier des notes non collectées et non affichées par le site.** Comparez la donnée source, le résultat de `safeParse()` et le JSON-LD du HTML construit.

## Validation

1. Exécutez `safeParse()` à la frontière des données.
2. Inspectez le script du HTML construit.
3. Lancez `unschema-graph audit` sur le dossier de sortie.
4. [Schema.org / official documentation](https://schema.org/Product).

## Checklist finale

- [ ] Le contenu balisé est visible et actuel.
- [ ] Chaque identité réutilisable possède un `@id` stable.
- [ ] La validation locale et l’audit du build passent.
- [ ] Les limites de garantie sont comprises.

Approfondir: [graphes et références](/fr/guides/graphs-and-references/), [validation](/fr/guides/validation/), [audit CLI](/fr/audit-and-quality/audit-cli/).
