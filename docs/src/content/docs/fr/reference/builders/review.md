---
title: Review builder
description: Référence du builder Review pour créer une entité Schema.org Review validée.
---

Le builder `Review` crée une entité `Review`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Review } from '@unschema-graph/astro';

// Svelte 5
import { Review } from '@unschema-graph/svelte';

// Core / Node.js
import { Review } from '@unschema-graph/core';
import { ReviewSchema } from '@unschema-graph/core';
```

Le schéma Zod `ReviewSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ReviewSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ReviewInput = SchemaInput<typeof ReviewSchema>;
type ReviewOutput = SchemaOutput<typeof ReviewSchema, 'Review'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Oui | — |
| `reviewRating` | [Rating](/fr/reference/builders/rating/) | Oui | — |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `reviewBody` | string | Non | — |
| `name` | string | Non | — |
| `itemReviewed` | string \| SchemaOrgEntity \| EntityReference | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Review`.

## Exemple minimal

```ts
import { Review } from '@unschema-graph/core';

const entity = Review({
  "author": "Ada Lovelace",
  "reviewRating": {
    "ratingValue": 5
  },
  "reviewBody": "Clear and reliable."
});
```

## Sortie

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "Ada Lovelace"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5,
    "bestRating": 5,
    "worstRating": 1
  },
  "reviewBody": "Clear and reliable."
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/)
- Utilisé par : [E-commerce](/fr/recipes/ecommerce/)
- Sources externes : [Schema.org Review](https://schema.org/Review)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Review.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
