---
title: Answer builder
description: Référence du builder Answer pour créer une entité Schema.org Answer validée.
---

Le builder `Answer` crée une entité `Answer`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Answer } from '@unschema-graph/astro';

// Svelte 5
import { Answer } from '@unschema-graph/svelte';

// Core / Node.js
import { Answer } from '@unschema-graph/core';
import { AnswerSchema } from '@unschema-graph/core';
```

Le schéma Zod `AnswerSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  AnswerSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type AnswerInput = SchemaInput<typeof AnswerSchema>;
type AnswerOutput = SchemaOutput<typeof AnswerSchema, 'Answer'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `text` | string | Oui | non-empty |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Answer`.

## Exemple minimal

```ts
import { Answer } from '@unschema-graph/core';

const entity = Answer({
  "text": "Use one validated graph per page."
});
```

## Sortie

```json
{
  "@type": "Answer",
  "text": "Use one validated graph per page."
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Answer](https://schema.org/Answer)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Answer.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
