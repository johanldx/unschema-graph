---
title: Comment builder
description: Référence du builder Comment pour créer une entité Schema.org Comment validée.
---

Le builder `Comment` crée une entité `Comment`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Comment } from '@unschema-graph/astro';

// Svelte 5
import { Comment } from '@unschema-graph/svelte';

// Core / Node.js
import { Comment } from '@unschema-graph/core';
import { CommentSchema } from '@unschema-graph/core';
```

Le schéma Zod `CommentSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  CommentSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type CommentInput = SchemaInput<typeof CommentSchema>;
type CommentOutput = SchemaOutput<typeof CommentSchema, 'Comment'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `text` | string | Oui | non-empty |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Oui | — |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `upvoteCount` | number | Non | integer; minimum: -9007199254740991; maximum: 9007199254740991 |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Comment`.

## Exemple minimal

```ts
import { Comment } from '@unschema-graph/core';

const entity = Comment({
  "text": "This pattern works well.",
  "author": "Grace Hopper"
});
```

## Sortie

```json
{
  "@type": "Comment",
  "text": "This pattern works well.",
  "author": {
    "@type": "Person",
    "name": "Grace Hopper"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Comment](https://schema.org/Comment)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Comment.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
