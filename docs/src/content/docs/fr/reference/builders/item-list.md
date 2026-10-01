---
title: ItemList builder
description: Référence du builder ItemList pour créer une entité Schema.org ItemList validée.
---

Le builder `ItemList` crée une entité `ItemList`, injecte son `@type`,
valide les données de manière synchrone et rejette les propriétés inconnues.

## Import

```ts
// Astro — shown first when Astro is selected
import { ItemList } from '@unschema-graph/astro';

// Svelte 5
import { ItemList } from '@unschema-graph/svelte';

// Core / Node.js
import { ItemList } from '@unschema-graph/core';
import { ItemListSchema } from '@unschema-graph/core';
```

Le schéma Zod `ItemListSchema` est également exporté pour la composition et la validation avancées.

## Types TypeScript

```ts
import {
  ItemListSchema,
  type SchemaInput,
  type SchemaOutput,
} from '@unschema-graph/core';

type ItemListInput = SchemaInput<typeof ItemListSchema>;
type ItemListOutput = SchemaOutput<typeof ItemListSchema, 'ItemList'>;
```

## Propriétés d’entrée

| Propriété | Type d’entrée | Obligatoire | Valeur par défaut / contraintes |
| --- | --- | :---: | --- |
| `@id` | string | Non | non-empty |
| `itemListElement` | Array<object \| string \| object> | Oui | minimum items: 1 |
| `name` | string | Non | — |
| `description` | string | Non | — |
| `itemListOrder` | string | Non | — |
| `numberOfItems` | number | Non | integer; minimum: 0; maximum: 9007199254740991 |

Les alias ci-dessus restent la référence exacte, notamment pour les objets imbriqués. Le builder
accepte aussi une configuration de validation en second argument et possède une sortie dont le
`@type` vaut toujours `ItemList`.

## Exemple minimal

```ts
import { ItemList } from '@unschema-graph/core';

const entity = ItemList({
  "name": "Featured guides",
  "itemListElement": [
    {
      "name": "Astro guide",
      "url": "/guides/astro"
    },
    {
      "name": "JSON-LD guide",
      "url": "/guides/json-ld"
    }
  ]
});
```

## Sortie

```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Astro guide",
      "url": "/guides/astro"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "JSON-LD guide",
      "url": "/guides/json-ld"
    }
  ],
  "name": "Featured guides"
}
```

## Relations et recettes

- Builders liés : [`Article`](/fr/reference/builders/article/), [`BlogPosting`](/fr/reference/builders/blog-posting/), [`NewsArticle`](/fr/reference/builders/news-article/), [`Recipe`](/fr/reference/builders/recipe/)
- Utilisé par : aucune recette dédiée
- Sources externes : [Schema.org ItemList](https://schema.org/ItemList)

## Erreurs fréquentes

- Passer une propriété inconnue au builder strict.
- Utiliser une donnée source privée d’une propriété obligatoire.
- Supposer qu’un Schema.org valide garantit un affichage dans la recherche.

## Validation

Utilisez `ItemList.safeParse(input)` pour les données externes. Pour une extension
Schema.org non encore modélisée, validez d’abord l’entité puis utilisez
`withAdditionalProperties()`. N’ajoutez jamais une propriété inventée au builder.
