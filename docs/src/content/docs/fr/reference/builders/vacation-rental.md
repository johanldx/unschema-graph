---
title: VacationRental builder
description: Référence du builder VacationRental pour créer une entité Schema.org VacationRental validée.
---

Le builder `VacationRental` crée une entité `VacationRental`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { VacationRental } from '@unschema-graph/astro';

// Svelte 5
import { VacationRental } from '@unschema-graph/svelte';

// Core / Node.js
import { VacationRental } from '@unschema-graph/core';
import { LodgingBusinessSchema } from '@unschema-graph/core';
```

Le schéma Zod `LodgingBusinessSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  LodgingBusinessSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type VacationRentalInput = SchemaInput<typeof LodgingBusinessSchema>;
type VacationRentalOutput = SchemaOutput<typeof LodgingBusinessSchema, 'VacationRental'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `address` | string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference \| string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Oui | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) | Non | non-empty |
| `telephone` | string | Non | — |
| `priceRange` | string | Non | — |
| `url` | string | Non | non-empty |
| `geo` | [GeoCoordinates](/fr/reference/builders/geo-coordinates/) \| string \| [GeoCoordinates](/fr/reference/builders/geo-coordinates/) | Non | non-empty |
| `openingHoursSpecification` | object \| Array<object> | Non | — |
| `currenciesAccepted` | string | Non | — |
| `paymentAccepted` | string | Non | — |
| `sameAs` | string \| Array<string> | Non | non-empty |
| `checkinTime` | string | Non | — |
| `checkoutTime` | string | Non | — |
| `numberOfRooms` | number | Non | integer; greater than 0; maximum: 9007199254740991 |
| `petsAllowed` | boolean \| string | Non | — |
| `amenityFeature` | string \| Array<string> \| string \| object \| Array<string \| object> | Non | non-empty |
| `starRating` | object | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `VacationRental`.

## Exemple minimal

```ts
import { VacationRental } from '@unschema-graph/core';

const entity = VacationRental({
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
});
```

## Sortie

```json
{
  "@type": "VacationRental",
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  }
}
```

## Relations et recettes

- Builders liés : [`Organization`](/fr/reference/builders/organization/), [`Person`](/fr/reference/builders/person/), [`LocalBusiness`](/fr/reference/builders/local-business/), [`Restaurant`](/fr/reference/builders/restaurant/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org VacationRental](https://schema.org/VacationRental)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `VacationRental.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
