---
title: GeoCoordinates builder
description: Référence du builder GeoCoordinates pour créer une entité Schema.org GeoCoordinates validée.
---

Le builder `GeoCoordinates` crée une entité `GeoCoordinates`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { GeoCoordinates } from '@unschema-graph/astro';

// Svelte 5
import { GeoCoordinates } from '@unschema-graph/svelte';

// Core / Node.js
import { GeoCoordinates } from '@unschema-graph/core';
import { GeoCoordinatesSchema } from '@unschema-graph/core';
```

Le schéma Zod `GeoCoordinatesSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  GeoCoordinatesSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type GeoCoordinatesInput = SchemaInput<typeof GeoCoordinatesSchema>;
type GeoCoordinatesOutput = SchemaOutput<typeof GeoCoordinatesSchema, 'GeoCoordinates'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `latitude` | number \| string | Oui | — |
| `longitude` | number \| string | Oui | — |
| `elevation` | number \| string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `GeoCoordinates`.

## Exemple minimal

```ts
import { GeoCoordinates } from '@unschema-graph/core';

const entity = GeoCoordinates({
  "latitude": 48.8566,
  "longitude": 2.3522
});
```

## Sortie

```json
{
  "@type": "GeoCoordinates",
  "latitude": 48.8566,
  "longitude": 2.3522
}
```

## Relations et recettes

- Builders liés : [`ImageObject`](/fr/reference/builders/image-object/), [`PostalAddress`](/fr/reference/builders/postal-address/), [`ContactPoint`](/fr/reference/builders/contact-point/)
- Utilisé par : [Commerce local](/fr/recipes/local-business/)
- Sources externes : [Schema.org GeoCoordinates](https://schema.org/GeoCoordinates)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `GeoCoordinates.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
