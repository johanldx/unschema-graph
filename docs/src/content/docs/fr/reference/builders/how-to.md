---
title: HowTo builder
description: Référence du builder HowTo pour créer une entité Schema.org HowTo validée.
---

Le builder `HowTo` crée une entité `HowTo`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { HowTo } from '@unschema-graph/astro';

// Svelte 5
import { HowTo } from '@unschema-graph/svelte';

// Core / Node.js
import { HowTo } from '@unschema-graph/core';
import { HowToSchema } from '@unschema-graph/core';
```

Le schéma Zod `HowToSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  HowToSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type HowToInput = SchemaInput<typeof HowToSchema>;
type HowToOutput = SchemaOutput<typeof HowToSchema, 'HowTo'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Oui | non-empty |
| `step` | Array<string \| object> | Oui | minimum items: 1 |
| `description` | string | Non | — |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `totalTime` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `estimatedCost` | string \| object | Non | — |
| `supply` | string \| Array<string> \| Array<object> | Non | — |
| `tool` | string \| Array<string> \| Array<object> | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `HowTo`.

## Exemple minimal

```ts
import { HowTo } from '@unschema-graph/core';

const entity = HowTo({
  "name": "Deploy an Astro site",
  "step": [
    "Build the site.",
    "Upload the generated files."
  ]
});
```

## Sortie

```json
{
  "@type": "HowTo",
  "name": "Deploy an Astro site",
  "step": [
    {
      "@type": "HowToStep",
      "text": "Build the site."
    },
    {
      "@type": "HowToStep",
      "text": "Upload the generated files."
    }
  ]
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org HowTo](https://schema.org/HowTo)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `HowTo.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
