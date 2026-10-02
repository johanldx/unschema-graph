---
title: PostalAddress builder
description: Référence du builder PostalAddress pour créer une entité Schema.org PostalAddress validée.
---

Le builder `PostalAddress` crée une entité `PostalAddress`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { PostalAddress } from '@unschema-graph/astro';

// Svelte 5
import { PostalAddress } from '@unschema-graph/svelte';

// Core / Node.js
import { PostalAddress } from '@unschema-graph/core';
import { PostalAddressSchema } from '@unschema-graph/core';
```

Le schéma Zod `PostalAddressSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  PostalAddressSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type PostalAddressInput = SchemaInput<typeof PostalAddressSchema>;
type PostalAddressOutput = SchemaOutput<typeof PostalAddressSchema, 'PostalAddress'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `streetAddress` | string | Non | — |
| `addressLocality` | string | Non | — |
| `addressRegion` | string | Non | — |
| `postalCode` | string | Non | — |
| `addressCountry` | string | Non | — |
| `postOfficeBoxNumber` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `PostalAddress`.

## Exemple minimal

```ts
import { PostalAddress } from '@unschema-graph/core';

const entity = PostalAddress({
  "streetAddress": "1 Rue de Rivoli",
  "addressLocality": "Paris",
  "postalCode": "75001",
  "addressCountry": "FR"
});
```

## Sortie

```json
{
  "@type": "PostalAddress",
  "streetAddress": "1 Rue de Rivoli",
  "addressLocality": "Paris",
  "postalCode": "75001",
  "addressCountry": "FR"
}
```

## Relations et recettes

- Builders liés : [`ImageObject`](/fr/reference/builders/image-object/), [`GeoCoordinates`](/fr/reference/builders/geo-coordinates/), [`ContactPoint`](/fr/reference/builders/contact-point/)
- Utilisé par : [Commerce local](/fr/recipes/local-business/), [Événements](/fr/recipes/events/)
- Sources externes : [Schema.org PostalAddress](https://schema.org/PostalAddress)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `PostalAddress.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
