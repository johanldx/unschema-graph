---
title: Offer builder
description: Référence du builder Offer pour créer une entité Schema.org Offer validée.
---

Le builder `Offer` crée une entité `Offer`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Offer } from '@unschema-graph/astro';

// Svelte 5
import { Offer } from '@unschema-graph/svelte';

// Core / Node.js
import { Offer } from '@unschema-graph/core';
import { OfferSchema } from '@unschema-graph/core';
```

Le schéma Zod `OfferSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  OfferSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type OfferInput = SchemaInput<typeof OfferSchema>;
type OfferOutput = SchemaOutput<typeof OfferSchema, 'Offer'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `price` | number \| string | Oui | — |
| `priceCurrency` | string | Oui | minimum length: 3; maximum length: 3 |
| `availability` | string | Non | — |
| `url` | string | Non | non-empty |
| `priceValidUntil` | string \| number \| Date | Non | non-empty |
| `itemCondition` | string | Non | — |
| `seller` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Offer`.

## Exemple minimal

```ts
import { Offer } from '@unschema-graph/core';

const entity = Offer({
  "price": 99,
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock"
});
```

## Sortie

```json
{
  "@type": "Offer",
  "price": 99,
  "priceCurrency": "EUR",
  "availability": "https://schema.org/InStock"
}
```

## Relations et recettes

- Builders liés : [`Product`](/fr/reference/builders/product/), [`AggregateOffer`](/fr/reference/builders/aggregate-offer/), [`Service`](/fr/reference/builders/service/), [`JobPosting`](/fr/reference/builders/job-posting/)
- Utilisé par : [E-commerce](/fr/recipes/ecommerce/), [Événements](/fr/recipes/events/)
- Sources externes : [Schema.org Offer](https://schema.org/Offer)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Offer.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
