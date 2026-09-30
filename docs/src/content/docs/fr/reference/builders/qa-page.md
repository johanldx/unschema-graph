---
title: QAPage builder
description: Référence du builder QAPage pour créer une entité Schema.org QAPage validée.
---

Le builder `QAPage` crée une entité `QAPage`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { QAPage } from '@unschema-graph/astro';

// Svelte 5
import { QAPage } from '@unschema-graph/svelte';

// Core / Node.js
import { QAPage } from '@unschema-graph/core';
import { QAPageSchema } from '@unschema-graph/core';
```

Le schéma Zod `QAPageSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  QAPageSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type QAPageInput = SchemaInput<typeof QAPageSchema>;
type QAPageOutput = SchemaOutput<typeof QAPageSchema, 'QAPage'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `mainEntity` | object | Oui | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `QAPage`.

## Exemple minimal

```ts
import { QAPage } from '@unschema-graph/core';

const entity = QAPage({
  "mainEntity": {
    "name": "How do I render JSON-LD in Astro?"
  }
});
```

## Sortie

```json
{
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": "How do I render JSON-LD in Astro?"
  }
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org QAPage](https://schema.org/QAPage)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `QAPage.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
