---
title: QAQuestion builder
description: Référence du builder QAQuestion pour créer une entité Schema.org Question validée.
---

Le builder `QAQuestion` crée une entité `Question`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { QAQuestion } from '@unschema-graph/astro';

// Svelte 5
import { QAQuestion } from '@unschema-graph/svelte';

// Core / Node.js
import { QAQuestion } from '@unschema-graph/core';
import { QAQuestionSchema } from '@unschema-graph/core';
```

Le schéma Zod `QAQuestionSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  QAQuestionSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QAQuestionInput = SchemaInput<typeof QAQuestionSchema>;
type QAQuestionOutput = SchemaOutput<typeof QAQuestionSchema, 'Question'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `text` | string | Non | — |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Non | — |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `acceptedAnswer` | object | Non | — |
| `suggestedAnswer` | object \| Array<object> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Question`.

## Exemple minimal

```ts
import { QAQuestion } from '@unschema-graph/core';

const entity = QAQuestion({
  "name": "How do I render JSON-LD in Astro?",
  "text": "I need a server-rendered graph."
});
```

## Sortie

```json
{
  "@type": "Question",
  "name": "How do I render JSON-LD in Astro?",
  "text": "I need a server-rendered graph."
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

Utilisez `QAQuestion.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
