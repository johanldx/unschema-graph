---
title: BreadcrumbList builder
description: Référence du builder BreadcrumbList pour créer une entité Schema.org BreadcrumbList validée.
---

Le builder `BreadcrumbList` crée une entité `BreadcrumbList`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { BreadcrumbList } from '@unschema-graph/astro';

// Svelte 5
import { BreadcrumbList } from '@unschema-graph/svelte';

// Core / Node.js
import { BreadcrumbList } from '@unschema-graph/core';
import { BreadcrumbListSchema } from '@unschema-graph/core';
```

Le schéma Zod `BreadcrumbListSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  BreadcrumbListSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type BreadcrumbListInput = SchemaInput<typeof BreadcrumbListSchema>;
type BreadcrumbListOutput = SchemaOutput<typeof BreadcrumbListSchema, 'BreadcrumbList'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `itemListElement` | Array<object> | Oui | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `BreadcrumbList`.

## Exemple minimal

```ts
import { BreadcrumbList } from '@unschema-graph/core';

const entity = BreadcrumbList({
  "itemListElement": [
    {
      "name": "Home",
      "item": "/"
    },
    {
      "name": "Guides",
      "item": "/guides/"
    },
    {
      "name": "Current page"
    }
  ]
});
```

## Sortie

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Guides",
      "item": "/guides/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Current page"
    }
  ]
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : [Blog et média](/fr/recipes/blog-media/)
- Sources externes : [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `BreadcrumbList.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
