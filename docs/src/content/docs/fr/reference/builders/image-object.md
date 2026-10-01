---
title: ImageObject builder
description: Référence du builder ImageObject pour créer une entité Schema.org ImageObject validée.
---

Le builder `ImageObject` crée une entité `ImageObject`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { ImageObject } from '@unschema-graph/astro';

// Svelte 5
import { ImageObject } from '@unschema-graph/svelte';

// Core / Node.js
import { ImageObject } from '@unschema-graph/core';
import { ImageObjectSchema } from '@unschema-graph/core';
```

Le schéma Zod `ImageObjectSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ImageObjectSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ImageObjectInput = SchemaInput<typeof ImageObjectSchema>;
type ImageObjectOutput = SchemaOutput<typeof ImageObjectSchema, 'ImageObject'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `url` | string | Oui | non-empty |
| `contentUrl` | string | Non | non-empty |
| `caption` | string | Non | — |
| `description` | string | Non | — |
| `width` | number \| string | Non | — |
| `height` | number \| string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `ImageObject`.

## Exemple minimal

```ts
import { ImageObject } from '@unschema-graph/core';

const entity = ImageObject({
  "url": "/images/cover.jpg",
  "caption": "Article cover"
});
```

## Sortie

```json
{
  "@type": "ImageObject",
  "url": "/images/cover.jpg",
  "caption": "Article cover"
}
```

## Relations et recettes

- Builders liés : [`PostalAddress`](/fr/reference/builders/postal-address/), [`GeoCoordinates`](/fr/reference/builders/geo-coordinates/), [`ContactPoint`](/fr/reference/builders/contact-point/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/)
- Sources externes : [Schema.org ImageObject](https://schema.org/ImageObject)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `ImageObject.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
