---
title: Recipe builder
description: Référence du builder Recipe pour créer une entité Schema.org Recipe validée.
---

Le builder `Recipe` crée une entité `Recipe`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { Recipe } from '@unschema-graph/astro';

// Svelte 5
import { Recipe } from '@unschema-graph/svelte';

// Core / Node.js
import { Recipe } from '@unschema-graph/core';
import { RecipeSchema } from '@unschema-graph/core';
```

Le schéma Zod `RecipeSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  RecipeSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type RecipeInput = SchemaInput<typeof RecipeSchema>;
type RecipeOutput = SchemaOutput<typeof RecipeSchema, 'Recipe'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `name` | string | Non | non-empty |
| `image` | string \| [ImageObject](/fr/reference/builders/image-object/) \| Array<string \| [ImageObject](/fr/reference/builders/image-object/)> | Non | non-empty |
| `recipeIngredient` | Array<string> | Non | minimum items: 1 |
| `recipeInstructions` | Array<string \| object> \| string | Non | minimum items: 1 |
| `author` | [Person](/fr/reference/builders/person/) \| [Organization](/fr/reference/builders/organization/) \| EntityReference | Non | — |
| `datePublished` | string \| number \| Date | Non | non-empty |
| `description` | string | Non | — |
| `prepTime` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `cookTime` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `totalTime` | string \| number \| DurationObject | Non | non-empty; greater than 0 |
| `recipeYield` | string \| number | Non | — |
| `recipeCategory` | string \| Array<string> | Non | — |
| `recipeCuisine` | string \| Array<string> | Non | — |
| `keywords` | string \| Array<string> | Non | — |
| `nutrition` | object | Non | — |
| `aggregateRating` | Aggregate[Rating](/fr/reference/builders/rating/) | Non | — |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `Recipe`.

## Exemple minimal

```ts
import { Recipe } from '@unschema-graph/core';

const entity = Recipe({
  "name": "Tomato pasta",
  "image": "/images/pasta.jpg",
  "recipeIngredient": [
    "200 g pasta",
    "2 tomatoes"
  ],
  "recipeInstructions": [
    "Cook the pasta.",
    "Add the tomatoes."
  ]
});
```

## Sortie

```json
{
  "@type": "Recipe",
  "name": "Tomato pasta",
  "image": "/images/pasta.jpg",
  "recipeIngredient": [
    "200 g pasta",
    "2 tomatoes"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "Cook the pasta."
    },
    {
      "@type": "HowToStep",
      "text": "Add the tomatoes."
    }
  ]
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`HowTo`](/fr/reference/builders/how-to/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org Recipe](https://schema.org/Recipe) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/recipe)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `Recipe.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
