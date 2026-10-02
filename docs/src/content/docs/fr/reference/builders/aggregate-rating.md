---
title: AggregateRating builder
description: Référence du builder AggregateRating pour créer une entité Schema.org AggregateRating validée.
---

Le builder `AggregateRating` crée une entité `AggregateRating`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { AggregateRating } from '@unschema-graph/astro';

// Svelte 5
import { AggregateRating } from '@unschema-graph/svelte';

// Core / Node.js
import { AggregateRating } from '@unschema-graph/core';
import { AggregateRatingSchema } from '@unschema-graph/core';
```

Le schéma Zod `AggregateRatingSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  AggregateRatingSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AggregateRatingInput = SchemaInput<typeof AggregateRatingSchema>;
type AggregateRatingOutput = SchemaOutput<typeof AggregateRatingSchema, 'AggregateRating'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `ratingValue` | number \| string | Oui | — |
| `bestRating` | number \| string | Non | default: 5 |
| `worstRating` | number \| string | Non | default: 1 |
| `ratingCount` | number | Non | integer; minimum: 0; maximum: 9007199254740991 |
| `reviewCount` | number | Non | integer; minimum: 0; maximum: 9007199254740991 |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `AggregateRating`.

## Exemple minimal

```ts
import { AggregateRating } from '@unschema-graph/core';

const entity = AggregateRating({
  "ratingValue": 4.8,
  "ratingCount": 125
});
```

## Sortie

```json
{
  "@type": "AggregateRating",
  "ratingValue": 4.8,
  "bestRating": 5,
  "worstRating": 1,
  "ratingCount": 125
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/)
- Utilisé par : [E-commerce](/fr/recipes/ecommerce/)
- Sources externes : [Schema.org AggregateRating](https://schema.org/AggregateRating)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `AggregateRating.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
