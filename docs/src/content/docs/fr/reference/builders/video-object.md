---
title: VideoObject builder
description: Référence du builder VideoObject pour créer une entité Schema.org VideoObject validée.
---

Le builder `VideoObject` crée une entité `VideoObject`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { VideoObject } from '@unschema-graph/astro';

// Svelte 5
import { VideoObject } from '@unschema-graph/svelte';

// Core / Node.js
import { VideoObject } from '@unschema-graph/core';
import { VideoObjectSchema } from '@unschema-graph/core';
```

Le schéma Zod `VideoObjectSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  VideoObjectSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type VideoObjectInput = SchemaInput<typeof VideoObjectSchema>;
type VideoObjectOutput = SchemaOutput<typeof VideoObjectSchema, 'VideoObject'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `description` | string | Oui | non-empty |
| `thumbnailUrl` | string \| Array<string> \| string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Oui | non-empty |
| `uploadDate` | string \| number \| Date | Oui | non-empty |
| `duration` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `contentUrl` | string | Non | non-empty |
| `embedUrl` | string | Non | non-empty |
| `hasPart` | object \| Array<object> | Non | — |
| `inLanguage` | string | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `VideoObject`.

## Exemple minimal

```ts
import { VideoObject } from '@unschema-graph/core';

const entity = VideoObject({
  "name": "Astro schema tutorial",
  "description": "Learn how to add JSON-LD to Astro.",
  "thumbnailUrl": "/images/video.jpg",
  "uploadDate": "2026-09-29"
});
```

## Sortie

```json
{
  "@type": "VideoObject",
  "name": "Astro schema tutorial",
  "description": "Learn how to add JSON-LD to Astro.",
  "thumbnailUrl": "/images/video.jpg",
  "uploadDate": "2026-09-29"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org VideoObject](https://schema.org/VideoObject)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `VideoObject.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
