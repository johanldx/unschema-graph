---
title: AggregateOffer builder
description: Référence du builder AggregateOffer pour créer une entité Schema.org AggregateOffer validée.
---

Le builder `AggregateOffer` crée une entité `AggregateOffer`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { AggregateOffer } from '@unschema-graph/astro';

// Svelte 5
import { AggregateOffer } from '@unschema-graph/svelte';

// Core / Node.js
import { AggregateOffer } from '@unschema-graph/core';
import { AggregateOfferSchema } from '@unschema-graph/core';
```

Le schéma Zod `AggregateOfferSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  AggregateOfferSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AggregateOfferInput = SchemaInput<typeof AggregateOfferSchema>;
type AggregateOfferOutput = SchemaOutput<typeof AggregateOfferSchema, 'AggregateOffer'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | — |
| `lowPrice` | number \| string | Oui | — |
| `highPrice` | number \| string | Non | — |
| `priceCurrency` | string | Oui | minimum length: 3; maximum length: 3 |
| `offerCount` | number \| string | Non | — |
| `offers` | [Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/) \| Array<[Offer](/fr/reference/builders/offer/) \| Aggregate[Offer](/fr/reference/builders/offer/)> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `AggregateOffer`.

## Exemple minimal

```ts
import { AggregateOffer } from '@unschema-graph/core';

const entity = AggregateOffer({
  "lowPrice": 79,
  "highPrice": 129,
  "priceCurrency": "EUR",
  "offerCount": 3
});
```

## Sortie

```json
{
  "@type": "AggregateOffer",
  "lowPrice": 79,
  "highPrice": 129,
  "priceCurrency": "EUR",
  "offerCount": 3
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`Offer`](/fr/reference/builders/offer/), [`Service`](/fr/reference/builders/service/), [`JobPosting`](/fr/reference/builders/job-posting/)
- Utilisé par : [E-commerce](/fr/recipes/ecommerce/)
- Sources externes : [Schema.org AggregateOffer](https://schema.org/AggregateOffer)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `AggregateOffer.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
