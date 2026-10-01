---
title: Recipe builder
description: Reference for the Recipe builder and its validated Schema.org Recipe output.
---

Creates a generic Schema.org Recipe and normalizes provided shorthands. The `Recipe` builder injects `@type`, validates synchronously, and
rejects unknown properties.

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

The `RecipeSchema` Zod schema is also exported for composition and advanced validation.

## TypeScript types

```ts
import {
  RecipeSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type RecipeInput = SchemaInput<typeof RecipeSchema>;
type RecipeOutput = SchemaOutput<typeof RecipeSchema, 'Recipe'>;
```

## Input properties

| Property | Input type | Required | Default / constraints |
| --- | --- | :---: | --- |
| `@id` | string | No | non-empty |
| `name` | string | No | non-empty |
| `image` | string \| [ImageObject](/reference/builders/image-object/) \| Array<string \| [ImageObject](/reference/builders/image-object/)> | No | non-empty |
| `recipeIngredient` | Array<string> | No | minimum items: 1 |
| `recipeInstructions` | Array<string \| object> \| string | No | minimum items: 1 |
| `author` | unknown | No | — |
| `datePublished` | string \| number \| Date | No | non-empty |
| `description` | string | No | — |
| `prepTime` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `cookTime` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `totalTime` | string \| number \| DurationObject | No | non-empty; greater than 0 |
| `recipeYield` | string \| number | No | — |
| `recipeCategory` | string \| Array<string> | No | — |
| `recipeCuisine` | string \| Array<string> | No | — |
| `keywords` | string \| Array<string> | No | — |
| `nutrition` | object | No | — |
| `aggregateRating` | Aggregate[Rating](/reference/builders/rating/) | No | — |

The aliases above remain the exact authority for nested object types. The builder also accepts a
validation configuration as its second argument and always returns `@type: 'Recipe'`.

## Minimal example

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

## Output

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

## Relationships and recipes

- Related builders: [`Article`](/reference/builders/article/), [`BlogPosting`](/reference/builders/blog-posting/), [`NewsArticle`](/reference/builders/news-article/), [`HowTo`](/reference/builders/how-to/)
- Used by: no dedicated recipe
- External sources: [Schema.org Recipe](https://schema.org/Recipe) · [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/recipe)

## Common errors

- Passing an unknown property to the strict builder.
- Using source data that is missing a required property.
- Assuming valid Schema.org guarantees a search appearance.

## Validation

Use `Recipe.safeParse(input)` for external data. If Schema.org supports a property that
is not modeled yet, validate the entity first and then use `withAdditionalProperties()`. Never
pass invented properties to the strict builder.
