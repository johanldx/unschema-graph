---
title: Restaurant builder
description: Référence du builder Restaurant pour créer une entité Schema.org Restaurant validée.
---

Le builder `Restaurant` crée une entité `Restaurant`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Restaurant } from '@unschema-graph/astro';

// Svelte 5
import { Restaurant } from '@unschema-graph/svelte';

// Core / Node.js
import { Restaurant } from '@unschema-graph/core';
import { LocalBusinessSchema } from '@unschema-graph/core';
```

Le schéma Zod `LocalBusinessSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  LocalBusinessSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type RestaurantInput = SchemaInput<typeof LocalBusinessSchema>;
type RestaurantOutput = SchemaOutput<typeof LocalBusinessSchema, 'Restaurant'>;
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
| `servesCuisine` | string \| Array<string> | Non | — |
| `menu` | string | Non | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Restaurant`.

## Exemple minimal

```ts
import { Restaurant } from '@unschema-graph/core';

const entity = Restaurant({
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "servesCuisine": "French"
});
```

## Sortie

```json
{
  "@type": "Restaurant",
  "name": "Acme Paris",
  "address": {
    "streetAddress": "1 Rue de Rivoli",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "servesCuisine": "French"
}
```

## Relations et recettes

- Builders liés : [`Organization`](/fr/reference/builders/organization/), [`Person`](/fr/reference/builders/person/), [`LocalBusiness`](/fr/reference/builders/local-business/), [`Store`](/fr/reference/builders/store/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Restaurant](https://schema.org/Restaurant)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Restaurant.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
