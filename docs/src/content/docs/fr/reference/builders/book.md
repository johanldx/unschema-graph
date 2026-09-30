---
title: Book builder
description: Référence du builder Book pour créer une entité Schema.org Book validée.
---

Le builder `Book` crée une entité `Book`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Book } from '@unschema-graph/astro';

// Svelte 5
import { Book } from '@unschema-graph/svelte';

// Core / Node.js
import { Book } from '@unschema-graph/core';
import { BookSchema } from '@unschema-graph/core';
```

Le schéma Zod `BookSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  BookSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BookInput = SchemaInput<typeof BookSchema>;
type BookOutput = SchemaOutput<typeof BookSchema, 'Book'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `author` | string \| [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference \| Array<string \| [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference> | Oui | — |
| `isbn` | string | Non | — |
| `bookFormat` | string | Non | — |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `publisher` | string \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Non | — |
| `inLanguage` | string | Non | — |
| `numberOfPages` | number | Non | integer; greater than 0; maximum: 9007199254740991 |
| `description` | string | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |
| `review` | [Review](/fr/reference/builders/review/) \| Array<[Review](/fr/reference/builders/review/)> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Book`.

## Exemple minimal

```ts
import { Book } from '@unschema-graph/core';

const entity = Book({
  "name": "The Astro Handbook",
  "author": "Ada Lovelace"
});
```

## Sortie

```json
{
  "@type": "Book",
  "name": "The Astro Handbook",
  "author": "Ada Lovelace"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Book](https://schema.org/Book)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Book.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
