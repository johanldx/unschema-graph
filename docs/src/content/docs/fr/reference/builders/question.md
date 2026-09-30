---
title: Question builder
description: Référence du builder Question pour créer une entité Schema.org Question validée.
---

Le builder `Question` crée une entité `Question`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Question } from '@unschema-graph/astro';

// Svelte 5
import { Question } from '@unschema-graph/svelte';

// Core / Node.js
import { Question } from '@unschema-graph/core';
import { QuestionSchema } from '@unschema-graph/core';
```

Le schéma Zod `QuestionSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  QuestionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QuestionInput = SchemaInput<typeof QuestionSchema>;
type QuestionOutput = SchemaOutput<typeof QuestionSchema, 'Question'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | — |
| `name` | string | Oui | non-empty |
| `acceptedAnswer` | object \| string | Oui | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Question`.

## Exemple minimal

```ts
import { Question } from '@unschema-graph/core';

const entity = Question({
  "name": "What is JSON-LD?",
  "acceptedAnswer": "A linked-data serialization format."
});
```

## Sortie

```json
{
  "@type": "Question",
  "name": "What is JSON-LD?",
  "acceptedAnswer": {
    "@type": "Answer",
    "text": "A linked-data serialization format."
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Question](https://schema.org/Question)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Question.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
