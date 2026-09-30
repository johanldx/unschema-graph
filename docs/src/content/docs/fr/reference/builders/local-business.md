---
title: LocalBusiness builder
description: Référence du builder LocalBusiness pour créer une entité Schema.org LocalBusiness validée.
---

Le builder `LocalBusiness` crée une entité `LocalBusiness`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { LocalBusiness } from '@unschema-graph/astro';

// Svelte 5
import { LocalBusiness } from '@unschema-graph/svelte';

// Core / Node.js
import { LocalBusiness } from '@unschema-graph/core';
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

type LocalBusinessInput = SchemaInput<typeof LocalBusinessSchema>;
type LocalBusinessOutput = SchemaOutput<typeof LocalBusinessSchema, 'LocalBusiness'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `address` | string \| [PostalAddress](/fr/reference/builders/postal-address/) \| EntityReference | Oui | — |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) | Non | non-empty |
| `telephone` | string | Non | — |
| `priceRange` | string | Non | — |
| `url` | string | Non | — |
| `geo` | [GeoCoordinates](/fr/reference/builders/geo-coordinates/) | Non | — |
| `openingHoursSpecification` | object \| Array<object> | Non | — |
| `currenciesAccepted` | string | Non | — |
| `paymentAccepted` | string | Non | — |
| `sameAs` | string \| Array<string> | Non | — |
| `servesCuisine` | string \| Array<string> | Non | — |
| `menu` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `LocalBusiness`.

## Exemple minimal

```ts
import { LocalBusiness } from '@unschema-graph/core';

const entity = LocalBusiness({
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
  "@type": "LocalBusiness",
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

- Builders liés : [`Organization`](/fr/reference/builders/organization/), [`Person`](/fr/reference/builders/person/), [`Restaurant`](/fr/reference/builders/restaurant/), [`Store`](/fr/reference/builders/store/)
- Utilisé par : [Commerce local](/fr/recipes/local-business/)
- Sources externes : [Schema.org LocalBusiness](https://schema.org/LocalBusiness) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/local-business)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `LocalBusiness.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
