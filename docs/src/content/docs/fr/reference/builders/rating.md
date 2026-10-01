---
title: Rating builder
description: Référence du builder Rating pour créer une entité Schema.org Rating validée.
---

Le builder `Rating` crée une entité `Rating`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Rating } from '@unschema-graph/astro';

// Svelte 5
import { Rating } from '@unschema-graph/svelte';

// Core / Node.js
import { Rating } from '@unschema-graph/core';
import { RatingSchema } from '@unschema-graph/core';
```

Le schéma Zod `RatingSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  RatingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type RatingInput = SchemaInput<typeof RatingSchema>;
type RatingOutput = SchemaOutput<typeof RatingSchema, 'Rating'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `ratingValue` | number \| string | Oui | — |
| `bestRating` | number \| string | Non | default: 5 |
| `worstRating` | number \| string | Non | default: 1 |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Rating`.

## Exemple minimal

```ts
import { Rating } from '@unschema-graph/core';

const entity = Rating({
  "ratingValue": 4.5
});
```

## Sortie

```json
{
  "@type": "Rating",
  "ratingValue": 4.5,
  "bestRating": 5,
  "worstRating": 1
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Rating](https://schema.org/Rating)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Rating.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
