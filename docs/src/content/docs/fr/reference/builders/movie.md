---
title: Movie builder
description: Référence du builder Movie pour créer une entité Schema.org Movie validée.
---

Le builder `Movie` crée une entité `Movie`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Movie } from '@unschema-graph/astro';

// Svelte 5
import { Movie } from '@unschema-graph/svelte';

// Core / Node.js
import { Movie } from '@unschema-graph/core';
import { MovieSchema } from '@unschema-graph/core';
```

Le schéma Zod `MovieSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  MovieSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type MovieInput = SchemaInput<typeof MovieSchema>;
type MovieOutput = SchemaOutput<typeof MovieSchema, 'Movie'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `director` | string \| object \| Array<string \| object> | Non | — |
| `actor` | string \| object \| Array<string \| object> | Non | — |
| `dateCreated` | string \| number \| Date | Non | non-empty |
| `duration` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `trailer` | [VideoObject](/fr/reference/builders/video-object/) | Non | — |
| `description` | string | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |
| `review` | [Review](/fr/reference/builders/review/) \| Array<[Review](/fr/reference/builders/review/)> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Movie`.

## Exemple minimal

```ts
import { Movie } from '@unschema-graph/core';

const entity = Movie({
  "name": "Journey to the Stars",
  "director": "Ada Lovelace"
});
```

## Sortie

```json
{
  "@type": "Movie",
  "name": "Journey to the Stars",
  "director": "Ada Lovelace"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Movie](https://schema.org/Movie)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Movie.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
